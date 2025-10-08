<template>
  <div class=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col music-page">
    <!-- 动态顶部栏 -->
    <SearchHeader
        v-if="activeTab === 'search'"
        :search-loading="searchLoading"
        v-model="searchTemp"
        :initial-api="selectedApi"
        :active-tab="activeTab"
        @search="handleSearch"
        @api-change="handleApiChange"
        @tab-change="handleTabChange"
        @setting="handleSettingFileLocation"
    />
    <DownloadedHeader
        v-else-if="activeTab === 'downloaded'"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
        @setting="handleSettingFileLocation"
    />
    <FavoriteHeader
        v-else-if="activeTab === 'favorite'"
        :active-tab="activeTab"
        @tab-change="handleTabChange"
        @setting="handleSettingFileLocation"
        @refresh="handleFavoriteRefresh"
    />
    <!-- 搜索结果列表 -->
    <template v-if="activeTab === 'search'"><SongList
          :songs="searchResults"
          :loading="searchLoading"
          :loading-text="'搜索中...'"
          :empty-text="searchKeyword ? '未找到相关歌曲' : '请输入关键词搜索歌曲'"
          :show-cover="false"
          :show-source="true"
          :show-play-button="true"
          :show-download-button="true"
          :show-favorite-button="false"
          :current-playing-song="playerStore.currentSong"
          :show-share-button="true"
          :show-delete-button="false"
          :favorite-songs="favoriteStore.favoriteSongs"
          @play="playSong"
          @download="handleDownloadClick"
          @favorite="toggleFavorite"
          @share="shareSong"
          @click="playSong"
      /></template>
    <template v-else-if="activeTab === 'downloaded'"><DownloadedMusic /></template>
    <template v-else-if="activeTab === 'favorite'"><FavoriteSongs ref="favoriteSongsRef" @download="handleDownloadClick"/></template>
    <!-- 歌曲详情页组件 -->
    <SongDetail
        :show="showSongDetail"
        :current-song="playerStore.currentSong"
        :is-playing="playerStore.isPlaying"
        :current-time="playerStore.currentTime"
        :duration="playerStore.duration"
        :volume="playerStore.volume"
        :is-muted="playerStore.isMuted"
        :play-mode="playerStore.playMode"
        :selected-br="playerStore.selectedBr"
        :br-options="brOptions"
        :activeTab="activeTab"
        :is-br-changing="playerStore.isBrChanging"
        @update:show="showSongDetail = $event"
        @update:selected-br="handleBrChange($event)"
        @close="handleDetailClose"
        @toggle-play="playerStore.togglePlay()"
        @play-previous="playerStore.playPrevious()"
        @play-next="playerStore.playNext()"
        @change-play-mode="playerStore.changePlayMode()"
        @toggle-mute="playerStore.toggleMute()"
        @set-volume="playerStore.setVolumeFromProgress($event)"
        @seek-audio="playerStore.seekAudio($event)"
        @download-song="downloadSong"
    />
    <!-- 底部播放控制栏 -->
    <BottomPlayer
        v-if="playerStore.hasCurrentSong"
        :current-song="playerStore.currentSong"
        :is-playing="playerStore.isPlaying"
        :current-time="playerStore.currentTime"
        :duration="playerStore.duration"
        :volume="playerStore.volume"
        :is-muted="playerStore.isMuted"
        :play-mode="playerStore.playMode"
        :is-favorite="isFavorite(playerStore.currentSong)"
        @toggle-favorite="toggleFavorite(playerStore.currentSong)"
        v-model:selected-br="playerStore.selectedBr"
        @update:selected-br="handleBrChange($event)"
        :br-options="brOptions"
        :is-br-changing="playerStore.isBrChanging"
        @cover-click="handleCoverClick"
        @toggle-play="playerStore.togglePlay()"
        @play-previous="playerStore.playPrevious()"
        @play-next="playerStore.playNext()"
        @change-play-mode="playerStore.changePlayMode()"
        @toggle-mute="playerStore.toggleMute()"
        @set-volume="playerStore.setVolumeFromProgress($event)"
        @seek-audio="playerStore.seekAudio($event)"

    />
    <!-- 默认播放控制栏 -->
    <DefaultPlayController v-else />
    <!-- 下载音质选择模态框 -->
    <DownloadQualitySelect
        ref="downloadQualitySelectRef"
        @confirm="handleDownloadConfirm"
        @cancel="handleDownloadCancel"
    />
  </div>
</template>
<script setup lang="ts">
import SongDetail from "@/components/music/SongDetail.vue"
import DownloadQualitySelect from '@/components/music/DownloadQualitySelect.vue'
import DefaultPlayController from "@/components/music/DefaultPlayController.vue"
import DownloadedMusic from '@/components/music/formList/DownloadedMusic.vue'
import BottomPlayer from "@/components/music/BottomPlayer.vue"
import SongList from "@/components/music/formList/SongList.vue"
import FavoriteHeader from "@/components/music/header/FavoriteHeader.vue"
import DownloadedHeader from "@/components/music/header/DownloadedHeader.vue"
import SearchHeader from "@/components/music/header/SearchHeader.vue"
import FavoriteSongs from "@/components/music/formList/FavoriteSongs.vue"

import { message } from 'ant-design-vue'
import { ref, onMounted, onUnmounted, watch,computed } from 'vue'
import { searchMusic, getMusicDetail, type UnifiedMusicItem } from '../api/music.ts'
import { useAppStore } from '../stores/index.ts'
import { usePlayerStore } from '../stores/playerStore.ts'
import { useDownloadStore } from '../stores/downloadStore.ts'
import { useFavoriteStore} from "../stores/favoriteStore.ts"

const appStore = useAppStore()
const playerStore = usePlayerStore()
const downloadStore = useDownloadStore()
const favoriteStore = useFavoriteStore()
const searchTemp = ref('')
const searchKeyword = ref('')                                  // 搜索关键词
const searchLoading = ref(false)                               // 搜索加载状态
const searchResults = ref<UnifiedMusicItem[]>([])              // 搜索结果列表
const selectedApi = ref<'qq' | 'wyy' | 'kw' | 'qishui'>('qq')  // 选择的音乐API
const pendingDownloadSong = ref<UnifiedMusicItem | null>(null) // 临时存储要下载的歌曲
const showSongDetail = ref(false)                              // 控制详情页显示隐藏
const downloadQualitySelectRef = ref<InstanceType<typeof DownloadQualitySelect> | null>(null)
const activeTab = ref<'search' | 'downloaded' | 'favorite'>('search') // 当前显示的内容类型
const favoriteSongsRef = ref<InstanceType<typeof FavoriteSongs> | null>(null) // 收藏列表组件引用
const apiOptions = playerStore.apiOptions // API选项
const brOptionsConfig = playerStore.brOptionsConfig  // 音质选项配置
const defaultBrConfig = playerStore.defaultBrConfig // 默认音质配置
const brOptions = computed(() => {
  if (!playerStore.currentSong) return []
  const source = playerStore.currentSong.source as keyof typeof brOptionsConfig
  return brOptionsConfig[source] || []
})

// 切换API
const handleApiChange = (newApi: 'qq' | 'wyy' | 'kw' | 'qishui') => {
  selectedApi.value = newApi
  playerStore.setCurrentApi(newApi)
  if (searchKeyword.value) handleSearch()
}
// 搜索
const handleSearch = async () => {
  // 验证输入
  if (!searchTemp.value.trim()) {
    message.error('请输入搜索关键词')
    return
  }
  searchKeyword.value =searchTemp.value
  playerStore.setSearchKeyword(searchKeyword.value)

  // 执行搜索
  searchLoading.value = true
  try {
    const result = await searchMusic(searchKeyword.value, selectedApi.value)

    if (result.code === 200) {
      searchResults.value = result.data || []
      playerStore.currentSongIndex = -1
    } else {
      message.error('搜索失败')
      searchResults.value = []
    }
  } catch (error) {
    message.error('搜索出错')
    console.error('搜索错误:', error)
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}
// 播放
const playSong = async (song: UnifiedMusicItem) => {
  try {
    const options: { br?: string, n?: number } = { n: song.n }
    if (selectedApi.value !== 'qishui') options.br = String(playerStore.selectedBr)
    const result = await getMusicDetail(searchKeyword.value, selectedApi.value, options)
    console.log('获取歌曲详情:', result)
    if (result.code === 200) await playerStore.playSong(result.data, searchResults.value, selectedApi.value,'search')
    else message.error('获取歌曲详情失败')

  } catch (error) {
    message.error('播放出错')
    console.error('播放错误:', error)
  }
}
// 切换音质
const handleBrChange = async (newBr: string) => {
  try {
    await playerStore.setSelectedBr(searchKeyword.value)
    message.success(`已切换到${getBrLabel(newBr)}音质`)
  } catch (error) {
    message.error('切换音质失败')
  }
}
// 获取音质标签
const getBrLabel = (brValue: string) => {
  const currentBrOption = brOptions.value.find(option => option.value === brValue)
  return currentBrOption?.label || brValue
}
// 收藏
const handleTabChange = (tab: string) => activeTab.value = tab as any
// 详情页
const handleCoverClick = () => playerStore.currentSong && (showSongDetail.value = !showSongDetail.value)// 点击封面切换详情页显示
const handleDetailClose = () => showSongDetail.value = false // 关闭详情页

// 下载
// 点击下载按钮
const handleDownloadClick = (song: UnifiedMusicItem) => {
  pendingDownloadSong.value = song
  // 打开音质选择模态框
  downloadQualitySelectRef.value?.openModal(song, selectedApi.value)
}
// 确认下载（选择了音质后）
const handleDownloadConfirm = async (quality: string) => {
  if (!pendingDownloadSong.value) return
  const song = pendingDownloadSong.value
  pendingDownloadSong.value = null
  // 调用原来的下载函数，传入选择的音质
  await downloadSong(song, quality)
}
// 取消下载歌曲
const handleDownloadCancel = () => {
  pendingDownloadSong.value = null
  message.info('已取消下载')
}
// 设置下载目录
const handleSettingFileLocation = async () => {
  try {
    // 检测环境
    const isElectron = typeof window !== 'undefined' && window.electronAPI

    if (isElectron) {
      // Electron 环境 - 使用对话框选择目录
      const result = await window.electronAPI.showOpenDialog({
        properties: ['openDirectory']
      })

      if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0]
        // 存储到 Pinia
        appStore.setMusicStoragePath(selectedPath as any)
        message.success(`下载目录已设置为: ${selectedPath}`)
        await downloadStore.refreshList(appStore.musicStoragePath)
      }
    } else {
      // 浏览器环境 - 提示用户无法设置
      message.warning('浏览器环境下无法自定义下载目录，文件将下载到浏览器默认下载位置')
    }
  } catch (error) {
    console.error('设置下载目录失败:', error)
    message.error('设置下载目录失败')
  }

}

// 下载歌曲
const downloadSong = async (song: UnifiedMusicItem, quality?: string) => {
  const isElectron = typeof window !== 'undefined' && window.electronAPI
  try {

    if (isElectron && !appStore.musicStoragePath) {
      message.warning('请先设置音乐下载目录')
      setTimeout(() => handleSettingFileLocation(), 500)
      return
    }

    let musicUrl = song.music_url
    let musicData = song
    let needGetDetail = false

    // 判断是否需要获取详情：如果没有 music_url 或者需要特定音质
    if (!musicUrl) needGetDetail = true

    if (needGetDetail) {
      // 需要搜索获取详情的情况
      const sourceApi = song.source as 'qq' | 'wyy' | 'kw' | 'qishui'
      const options: { br?: string, n?: number } = { n: song.n }

      if (sourceApi !== 'qishui') {
        options.br = quality || String(playerStore.selectedBr)
      }

      // 使用原始的搜索关键词
      const result = await getMusicDetail(searchKeyword.value, sourceApi, options)
      console.log('API返回结果:', result)

      if (result.code === 200 && result.data.music_url) {
        musicData = result.data
        musicUrl = result.data.music_url
      } else {
        message.error('获取下载链接失败')
        return
      }
    }

    // 确保有下载链接
    if (!musicUrl) {
      message.error('没有找到可下载的音频链接')
      return
    }

    // 生成下载信息
    const qualityLabel = musicData.quality ||
        brOptionsConfig[musicData.source]?.find(opt => opt.value === (quality || playerStore.selectedBr))?.label ||
        (quality || playerStore.selectedBr)

    const sourceLabel = apiOptions.find(opt => opt.value === musicData.source)?.label || musicData.source

    const musicInfo = {
      title: musicData.title,
      singer: musicData.singer,
      source: sourceLabel,
      quality: String(qualityLabel),
      cover: musicData.cover,
      link: musicData.link,
      lyric: musicData.lyric,
    }

    console.log('准备下载的音乐信息:', musicInfo, '下载链接:', musicUrl)
    if (isElectron) {
      const loadingMessage = message.loading(`正在下载: ${musicData.title}`, 0)

      try {
        console.log('调用 electronAPI.downloadMusic...')
        const success = await window.electronAPI.downloadMusic({
          musicUrl: musicUrl!,
          musicInfo: musicInfo,
          savePath: appStore.musicStoragePath
        })
        loadingMessage()
        console.log('下载结果:', success)
        if (success) message.success(`下载完成: ${musicData.title} (${qualityLabel})`)
        else message.error('下载失败')
      } catch (error) {
        loadingMessage()
        message.error('下载过程出错')
        console.error('下载错误:', error)
      }
    } else {
      message.info('浏览器环境下将使用默认下载')
    }

  } catch (error) {
    message.error('下载出错')
    console.error('下载错误:', error)
  }
}
// 收藏
const toggleFavorite = (song: UnifiedMusicItem | null) => {
  if (!song) return
  if (favoriteStore.isFavorite(song)) {
    favoriteStore.removeFavorite(song)
    message.success('已取消收藏')
  } else {
    console.log('收藏歌曲:', song)
    favoriteStore.addFavorite(song)
    message.success('已收藏')
  }
}
const isFavorite = (song: UnifiedMusicItem | null) => {
  if(song === null) return false
  else return favoriteStore.isFavorite(song)
}
const handleFavoriteRefresh = () => {
  if (favoriteSongsRef.value)
    favoriteSongsRef.value.refreshList()   // 调用 FavoriteSongs 组件的刷新方法
  console.log('刷新收藏列表')
}

// 分享
const shareSong = async (song: UnifiedMusicItem) => {
  try {
    // 如果需要获取完整信息，先调用接口
    const result = await getMusicDetail(song.title, selectedApi.value, { n: song.n })

    if (result.code === 200 && result.data) {
      const detail = result.data
      const shareText = `(歌曲:${detail.title}-歌手:${detail.singer}-来源:${song.source})-${detail.music_url  || '暂无'}-下载源:${detail.link || '暂无'}`

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
      message.success('已复制到剪贴板')
    }
  } catch (error) {
    message.error('分享失败')
  }
}
watch(selectedApi, (newApi) => {
  playerStore.setCurrentApi(newApi)
  handleSearch()
})
// 生命周期
onMounted(() => playerStore.selectedBr = defaultBrConfig[selectedApi.value])
onUnmounted(() => {})
onMounted(() => {
  console.log('🔍 Electron API 调试信息:')
  console.log('window.electronAPI:', window.electronAPI)
  console.log('downloadMusic 方法:', window.electronAPI?.downloadMusic)
  console.log('platform:', window.electronAPI?.platform)
})
</script>

<style scoped>
.animate-spin {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 使用深度选择器确保滚动条样式在动态高度下生效 */
:deep(.custom-scrollbar) {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
}

:deep(.custom-scrollbar)::-webkit-scrollbar {
  width: 8px;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
  rgba(59, 130, 246, 0.6) 0%,
  rgba(37, 99, 235, 0.6) 50%,
  rgba(59, 130, 246, 0.6) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

:deep(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,
  rgba(59, 130, 246, 0.8) 0%,
  rgba(37, 99, 235, 0.8) 50%,
  rgba(59, 130, 246, 0.8) 100%);
}

:deep(.custom-scrollbar)::-webkit-scrollbar-thumb:active {
  background: linear-gradient(180deg,
  rgba(29, 78, 216, 0.9) 0%,
  rgba(30, 64, 175, 0.9) 50%,
  rgba(29, 78, 216, 0.9) 100%);
}

/* 暗色模式滚动条 */
.dark :deep(.custom-scrollbar) {
  scrollbar-color: rgba(96, 165, 250, 0.5) transparent;
}

.dark :deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
  rgba(96, 165, 250, 0.6) 0%,
  rgba(59, 130, 246, 0.6) 50%,
  rgba(96, 165, 250, 0.6) 100%);
}

.dark :deep(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,
  rgba(96, 165, 250, 0.8) 0%,
  rgba(59, 130, 246, 0.8) 50%,
  rgba(96, 165, 250, 0.8) 100%);
}
</style>