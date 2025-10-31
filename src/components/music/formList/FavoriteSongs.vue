<!-- components/music/FavoriteSongs.vue -->
<template>
<!--  <div class="flex-1 px-4 mx-auto w-full overflow-y-auto -mt-1">-->
    <!-- 收藏歌曲列表 -->
    <SongList
        :currListName="'favorite'"
        :songs="localFavoriteSongs"
        :loading="refreshing"
        :loading-text="'加载中...'"
        :empty-text="'暂无收藏的歌曲'"
        :show-cover="true"
        :show-source="true"
        :show-play-button="true"
        :show-download-button="false"
        :show-favorite-button="true"
        :show-share-button="true"
        :show-delete-button="false"
        :start-index="1"
        :current-playing-song="playerStore.currentSong"
        :favorite-songs="favoriteSongKeys"
        @play="playFavoriteSong"
        @download="downloadFavoriteSong"
        @share="shareFavoriteSong"
        @toggle-favorite="toggleFavorite"
        @delete="removeFavoriteSong"
        @click="playFavoriteSong"
    />
<!--  </div>-->
</template>

<!-- FavoriteSongs.vue -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import SongList from '@/components/music/formList/SongList.vue'
import type { UnifiedMusicItem } from '../../../types/music/music.ts'
import { usePlayerStore } from '../../../stores/playerStore.ts'
import { useFavoriteStore } from '../../../stores/favoriteStore.ts'
import { message } from 'ant-design-vue'
// import DownloadedMusic from "@/components/music/formList/DownloadedMusic.vue";

const playerStore = usePlayerStore()
const favoriteStore = useFavoriteStore()
const emit = defineEmits<{
  'download': [song: UnifiedMusicItem]
}>()
// 创建本地响应式变量来存储收藏列表
const localFavoriteSongs = ref<UnifiedMusicItem[]>([])
const refreshing = computed(() => favoriteStore.refreshing)

// 监听 Pinia 的刷新状态，只在手动刷新时更新
watch(() => favoriteStore.refreshing, (isRefreshing) => {
  if (!isRefreshing) {
    // 只有手动刷新完成时才更新本地列表
    localFavoriteSongs.value = [...favoriteStore.favoriteSongs]
    console.log('手动刷新完成，更新本地列表，数量:', localFavoriteSongs.value.length)
  }
})

// 生成收藏歌曲的键集合（用于 SongList 组件）
const favoriteSongKeys = computed(() => {
  const keys = new Set<string>()
  localFavoriteSongs.value.forEach(song => {
    if (song.music_url) keys.add(favoriteStore.getSongKey(song))
  })
  return keys
})

// 手动刷新收藏列表
const refreshList = async () => {
  try {
    console.log('开始刷新收藏列表...')
    await favoriteStore.refreshFavorites()
    // 刷新完成后立即更新本地列表
    localFavoriteSongs.value = [...favoriteStore.favoriteSongs]
    console.log('刷新完成，当前收藏数量:', localFavoriteSongs.value.length)
  } catch (error: any) {
    message.error(error.message || '刷新收藏列表失败')
    console.error('刷新收藏列表错误:', error)
  }
}

// 播放收藏的歌曲
const playFavoriteSong = async (song: UnifiedMusicItem) => {
  try {
    console.log('播放前检查本地收藏列表:', localFavoriteSongs.value.length)
    console.log('播放前检查favoriteStore列表:', favoriteStore.favoriteSongs.length)

    // 确保使用最新的本地收藏列表
    const currentList = [...localFavoriteSongs.value]
    await playerStore.playSong(song, currentList, song.source as any, 'favorite')
    message.success(`播放: ${song.title || song.name || '未知歌曲'}`)
  } catch (error) {
    message.error('播放失败')
    console.error('播放错误:', error)
  }
}

// 下载收藏的歌曲
const downloadFavoriteSong = async (song: UnifiedMusicItem) => {
  console.log('开始下载收藏的歌曲...',song)
  emit('download', song)
  favoriteStore.addFavorite(song)
}

// 判断是否为有效的 HTTP/HTTPS 链接
const isValidHttpUrl = (url: string): boolean => {
  if (!url) return false
  return url.includes('http://') || url.includes('https://')
}

// 分享收藏的歌曲
const shareFavoriteSong = async (song: UnifiedMusicItem) => {

  // 构建分享文本
  let shareText = `歌曲: ${song.title} - 歌手: ${song.singer} - 来源: ${song.source}`

  // 根据 music_url 类型添加不同的内容
  if (song.music_url) {
    if (isValidHttpUrl(song.music_url)) {
      // 如果是 HTTP/HTTPS 链接，直接分享链接
      shareText += ` - 在线播放: ${song.music_url}`
    } else {
      // 如果是本地路径，添加提示
      shareText += ` - 本地音乐路径: ${song.music_url}`
    }
  }

  // 如果有额外的链接也加上
  if (song?.link && isValidHttpUrl(song.link)) {
    shareText += ` - 歌曲源链接: ${song.link}`
  }

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

    // 根据链接类型显示不同的提示消息
    if (song.music_url && !isValidHttpUrl(song.music_url)) {
      message.success('已复制歌曲信息到剪贴板 - 这是本地文件路径，请确保分享对象可以访问该路径')
    } else {
      message.success('已复制歌曲信息到剪贴板')
    }
  } catch (error) {
    message.error('分享失败')
  }
}

// 切换收藏状态（取消收藏）- 不立即刷新列表
const toggleFavorite = async (song: UnifiedMusicItem) => {
  try {
    const success = favoriteStore.toggleFavorite(song)
    if (success) {
      if (favoriteStore.isFavorite(song)) {
        message.success('已收藏')
        // 收藏操作：立即更新列表，因为用户希望看到新收藏的歌曲
        localFavoriteSongs.value = [...favoriteStore.favoriteSongs]
      } else {
        message.success('已取消收藏')
        // 取消收藏：不立即刷新列表，给用户后悔时间
        // 列表保持不变，用户可以通过刷新按钮恢复
      }
    }
  } catch (error) {
    message.error('操作失败')
    console.error('收藏操作错误:', error)
  }
}

// 移除收藏歌曲 - 不立即刷新列表
const removeFavoriteSong = async (song: UnifiedMusicItem) => {
  try {
    const success = favoriteStore.removeFavorite(song)
    if (success) {
      message.success('已移除收藏')
      // 移除收藏：不立即刷新列表，给用户后悔时间
    } else {
      message.error('移除失败')
    }
  } catch (error) {
    message.error('移除失败')
    console.error('移除收藏错误:', error)
  }
}

// 清空所有收藏 - 立即刷新列表
const clearAll = async () => {
  if (localFavoriteSongs.value.length === 0) return

  try {
    favoriteStore.clearAll()
    message.success('清空成功')
    // 清空后立即刷新列表
    localFavoriteSongs.value = []
  } catch (error: any) {
    message.error(error.message || '清空失败')
    console.error('清空错误:', error)
  }
}

// 暴露方法给父组件 - 确保方法名正确
defineExpose({
  refreshList,
  clearAll
})

onMounted(() => {
  // 初始化时加载数据
  localFavoriteSongs.value = [...favoriteStore.favoriteSongs]
  console.log('初始收藏列表数量:', localFavoriteSongs.value.length)
})
</script>