<!-- components/music/DownloadedMusic.vue -->
<template>
<!--  <div class="flex-1 px-4 mx-auto w-full overflow-y-auto -mt-1">-->
    <!-- 下载歌曲列表 -->
    <SongList
        :currListName="'downloaded'"
        :songs="downloadedSongs"
        :loading="refreshing"
        :loading-text="'加载中...'"
        :empty-text="'暂无下载的歌曲'"
        :show-cover="true"
        :show-source="true"
        :show-play-button="true"
        :show-download-button="false"
        :show-favorite-button="false"
        :show-share-button="true"
        :show-delete-button="true"
        :start-index="1"
        :current-playing-song="playerStore.currentSong"
        @play="playDownloadedSong"
        @share="shareDownloadedSong"
        @delete="openDeleteConfirm"
        @click="playDownloadedSong"
    />
    <!-- 删除确认提示框 -->
    <ConfirmModal
        ref="deleteConfirmModal"
        title="删除歌曲"
        :content="`确定要删除《${songToDelete?.title}》吗？`"
        warningText="这将会同时删除当前记录和本地文件,此操作不可恢复!"
        type="danger"
        confirmText="删除"
        @confirm="deleteSong"
    />
<!--  </div>-->
</template>

<script setup lang="ts">
import { onMounted, computed,ref } from 'vue'
import { message } from 'ant-design-vue'
import SongList from '@/components/music/formList/SongList.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { type DownloadedMusicItem } from '../../../types/electron.d'
import { usePlayerStore } from '../../../stores/playerStore.ts'
import { useAppStore } from '../../../stores'
import { useDownloadStore }     from '../../../stores/downloadStore.ts'
import { useFavoriteStore } from "../../../stores/favoriteStore.ts";
import { type UnifiedMusicItem } from '../../../api/music.ts'
const playerStore = usePlayerStore()
const appStore = useAppStore()
const downloadStore = useDownloadStore()
const favoriteStore = useFavoriteStore()
// 使用 store 中的状态
const downloadedSongs = computed(() => downloadStore.downloadedSongs)
const refreshing = computed(() => downloadStore.refreshing)
const deleteConfirmModal = ref()  // 删除确认模态框引用
const songToDelete = ref<DownloadedMusicItem | null>(null) // 待删除的歌曲
// 刷新列表
const refreshList = async () => {
  if (!appStore.musicStoragePath) {
    message.warning('请先设置下载目录')
    return
  }

  try {
    await downloadStore.refreshList(appStore.musicStoragePath)
  } catch (error: any) {
    message.error(error.message || '获取下载列表失败')
    console.error('获取下载列表错误:', error)
  }
}

// 将 DownloadedMusicItem 转换为 UnifiedMusicItem
const convertToUnifiedMusicItem = (song: DownloadedMusicItem): UnifiedMusicItem => {
  return {
    id: song.id,
    title: song.title,
    singer: song.singer,
    source: song.source as 'qq' | 'wyy' | 'kw' | 'qishui',
    cover: song.cover,
    music_url: song.filePath.startsWith('file://') ? song.filePath : `file://${song.filePath}`,
    n: song.n || 0,
    lyric: song.lyric,
    quality: song.quality,
    link: song.link
  }
}

// 播放下载的歌曲
const playDownloadedSong = async (song: DownloadedMusicItem) => {
  try {
    const unifiedSong = convertToUnifiedMusicItem(song)

    // 将整个下载列表转换为 UnifiedMusicItem 格式
    const unifiedPlaylist: UnifiedMusicItem[] = downloadedSongs.value.map(downloadedSong =>
        convertToUnifiedMusicItem(downloadedSong)
    )
    // 播放歌曲并设置列表模式为 'downloaded'
    await playerStore.playSong(unifiedSong, unifiedPlaylist, song.source as any, 'downloaded')
    message.success(`播放: ${song.title}`)
  } catch (error) {
    message.error('播放失败，文件可能已被删除')
    console.error('播放错误:', error)
    await refreshList()
  }
}

// 打开删除确认对话框
const openDeleteConfirm = (song: DownloadedMusicItem) => {
  songToDelete.value = song
  deleteConfirmModal.value.openModal()
}

// 实际删除歌曲
const deleteSong = async () => {
  if (!songToDelete.value) return

  // 如果是当前歌曲的话，重置播放,避免占用导致无法删除
  if(songToDelete.value?.music_url === playerStore.currentSong?.music_url){
    playerStore.currentSong = null
    playerStore.resetPlayer()
  }

  // 从收藏中移除已删除的歌曲
  console.log('准备删除歌曲:', songToDelete.value)
  if (favoriteStore.isFavorite(songToDelete.value)) {
    console.log('从收藏中移除已删除的歌曲:', songToDelete.value)
      favoriteStore.removeFavorite(songToDelete.value as UnifiedMusicItem)

  }

  try {
    if (typeof window !== 'undefined' && window.electronAPI) {
      const success = await window.electronAPI.deleteDownloadedMusic(appStore.musicStoragePath, songToDelete.value.id)
      if (success) {
        message.success('删除成功')
        await refreshList()
      } else {
        message.error('删除失败,(当前歌曲被占用可能会删除失败,请重新删除)')
      }
    }
  } catch (error) {
    message.error('删除失败')
    console.error('删除错误:', error)
  } finally {
    songToDelete.value = null
  }
}

// 分享歌曲信息
const shareDownloadedSong = async (song: DownloadedMusicItem) => {
  const shareText = `歌曲: ${song.title} - 歌手: ${song.singer} - 音质: ${song.quality} - 来源: ${song.source}`

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    message.success('已复制歌曲信息到剪贴板')
  } catch (error) {
    message.error('分享失败')
  }
}

// 清空所有下载
const clearAll = async () => {
  if (downloadedSongs.value.length === 0) return

  try {
    if (!appStore.musicStoragePath) {
      message.warning('请先设置下载目录')
      return
    }

    await downloadStore.clearAll(appStore.musicStoragePath)
    message.success('清空成功')
  } catch (error: any) {
    message.error(error.message || '清空失败')
    console.error('清空错误:', error)
  }
}

// 暴露方法给父组件（如果需要）
defineExpose({
  refreshList,
  clearAll
})

onMounted(() => {
  refreshList()
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.downloaded-music-container {
  min-height: 400px;
}

:deep(.song-list-empty) {
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

:deep(.song-list-loading) {
  padding: 40px 20px;
  text-align: center;
}
</style>