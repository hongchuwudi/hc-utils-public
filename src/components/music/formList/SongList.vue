<!-- components/music/SongList.vue -->
<template>
  <div class="flex-1 px-4 py-4 mx-auto w-full overflow-y-auto ">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
      <svg class="animate-spin w-8 h-8 text-blue-500 mb-3" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm">{{ loadingText || '加载中...' }}</span>
    </div>
    <!-- 空状态 -->
    <div v-else-if="songs.length === 0 && emptyState" class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 max-h-[80vh]">
      <Music class="w-16 h-16 mb-3 opacity-50" />
      <span class="text-sm">{{ emptyText || '暂无歌曲' }}</span>
    </div>
    <!-- 歌曲列表 -->
    <div v-else-if="songs.length > 0" class="custom-scrollbar overflow-y-auto max-h-[80vh]">
      <div class="space-y-1 pr-2">
        <div
            v-for="(song, index) in songs"
            :key="getSongKey(song, index)"
            class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            :class="{
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800': isCurrentPlaying(song),
                    'bg-white dark:bg-gray-900': !isCurrentPlaying(song)
            }"
            @click="handleSongClick(song)"
        >
          <!-- 左侧：歌曲信息 -->
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <!-- 序号或封面 -->
            <div class="w-6 flex-shrink-0 flex justify-center">
              <span
                  v-if="!showCover"
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {{ getSongIndex(song, index) }}
              </span>
              <img
                  v-else-if="song.localCover || song.cover"
                  :src="song.localCover ? song.localCover : song.cover"
                  alt="Cover"
                  class="w-6 h-6 rounded object-cover"
              />
              <img
                  v-else
                  src="https://pic2.zhimg.com/v2-2d44b34343fadb3f01872fa244580bc1_r.jpg"
                  alt="Cover"
                  class="w-6 h-6 rounded object-cover"
              />
            </div>
            <!-- 歌曲详情 -->
            <div class="min-w-0 flex-1">
              <div class="font-medium text-sm truncate">{{ song.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ song.singer }}</div>
            </div>
            <!-- 来源标签 -->
            <span v-if="showSource" class="text-xs text-gray-400 dark:text-gray-500 capitalize mr-5">
              {{ song.source }}
            </span>
          </div>
          <!-- 右侧：操作按钮 -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- 播放按钮 -->
            <ProButton
                v-if="showPlayButton"
                type="ghost"
                size="sm"
                :icon="isCurrentPlaying(song) ? Pause : Play"
                @click.stop="emit('play', song)"
                tooltip="播放"
                tooltip-position="bottom"
            />
            <!-- 下载按钮 -->
            <ProButton
                v-if="showDownloadButton"
                type="ghost"
                size="sm"
                :icon="Download"
                @click.stop="emit('download', song)"
                tooltip="下载"
                tooltip-position="bottom"
            />
            <!-- 收藏按钮 -->
            <ProButton
                v-if="showFavoriteButton"
                type="ghost"
                size="sm"
                :icon="isFavorite(song) ? Heart : HeartOutline"
                @click.stop="emit('toggle-favorite', song)"
                :tooltip="isFavorite(song) ? '取消收藏' : '收藏'"
                tooltip-position="bottom"
                :class="[
                  isFavorite(song)
                  ? 'text-red-500 hover:text-red-600 [&_svg]:fill-red-500 [&_svg]:text-red-500'
                  : 'text-gray-600 dark:text-gray-400 [&_svg]:fill-none'
                ]"
            />
            <!-- 分享按钮 -->
            <ProButton
                v-if="showShareButton"
                type="ghost"
                size="sm"
                :icon="Share"
                @click.stop="emit('share', song)"
                tooltip="分享"
                tooltip-position="bottom"
            />
            <!-- 删除按钮 -->
            <ProButton
                v-if="showDeleteButton"
                type="ghost"
                size="sm"
                :icon="Trash2"
                @click.stop="emit('delete', song)"
                tooltip="删除"
                tooltip-position="bottom"
            />
            <!-- 自定义插槽 -->
            <slot name="actions" :song="song" :index="index" />
          </div>
        </div>
        <!-- 关键：添加透明占位元素 -->
        <div class="h-15 opacity-0 pointer-events-none"></div>
      </div>
    </div>
    <!-- 自定义空状态插槽 -->
    <slot v-else name="empty" />
  </div>
</template>

<script setup lang="ts">
import { Music, Play,Pause, Download, Share, Trash2, Heart , HeartOff as HeartOutline} from 'lucide-vue-next'
import ProButton from '@/components/common/proButton.vue'
import type { UnifiedMusicItem } from '../../../api/music.ts'
import type { DownloadedMusicItem } from '../../../types/electron'
import {useFavoriteStore} from "../../../stores/favoriteStore.ts"
import {usePlayerStore} from "../../../stores/playerStore.ts"

// 合并两种歌曲类型
type SongItem = UnifiedMusicItem | DownloadedMusicItem
const favoriteStore = useFavoriteStore()
interface Props {
  currListName: string
  songs: SongItem[]
  loading?: boolean
  loadingText?: string
  emptyText?: string
  emptyState?: boolean
  showCover?: boolean
  showSource?: boolean
  showPlayButton?: boolean
  showDownloadButton?: boolean
  showFavoriteButton?: boolean
  showShareButton?: boolean
  showDeleteButton?: boolean
  favoriteSongs?: Set<string> | Array<string>
  startIndex?: number,
  currentPlayingSong?: UnifiedMusicItem | null  // 当前播放的歌曲
}
const props = withDefaults(defineProps<Props>(), {
  currListName : 'search',
  songs: () => [],
  loading: false,
  loadingText: '',
  emptyText: '',
  emptyState: true,
  showCover: false,
  showSource: true,
  showPlayButton: true,
  showDownloadButton: true,
  showFavoriteButton: false,
  showShareButton: true,
  showDeleteButton: false,
  favoriteSongs: () => new Set<string>(),
  startIndex: 1,
  currentPlayingSong: null
})
const emit = defineEmits<{
  'play': [song: SongItem]
  'download': [song: SongItem]
  'share': [song: SongItem]
  'delete': [song: SongItem]
  'toggle-favorite': [song: SongItem]
  'click': [song: SongItem]
}>()
const playerStore = usePlayerStore()

// 生成唯一的歌曲键
const getSongKey = (song: SongItem, index: number) => {
  // 使用类型断言
  const songWithId = song as { id: string | number; source?: string }
  if (songWithId.id) return `${songWithId.source || 'unknown'}-${songWithId.id}-${index}`
  return `downloaded-${index}-${Date.now()}`
}

// 判断是否是当前歌曲
const isCurrentPlaying = (song: SongItem) => {
  if (!playerStore?.currentSong) return false
  const playerSong = playerStore.currentSong
  // 确保ID和来源都匹配，考虑ID类型（字符串/数字）可能不同
  if(playerStore.currentListMode === 'search') return String(song.id) === String(playerSong.id) && song.source === playerSong.source && playerSong.title === song.title
  else return String(song.id) === String(playerSong.id) && song.source === playerSong.source && playerSong.music_url === song.music_url
}

// 获取歌曲序号
const getSongIndex = (song: SongItem, index: number) => song.n || (props.startIndex + index)

// 检查是否收藏
const isFavorite = (song: UnifiedMusicItem | DownloadedMusicItem) => {
  if(song === null) return false
  else return favoriteStore.isFavorite(song)
}

// 处理歌曲点击
const handleSongClick = (song: SongItem) => emit('click', song)
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
  rgba(59, 130, 246, 0.6) 0%,
  rgba(37, 99, 235, 0.6) 50%,
  rgba(59, 130, 246, 0.6) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg,
  rgba(59, 130, 246, 0.8) 0%,
  rgba(37, 99, 235, 0.8) 50%,
  rgba(59, 130, 246, 0.8) 100%);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,
  rgba(96, 165, 250, 0.6) 0%,
  rgba(59, 130, 246, 0.6) 50%,
  rgba(96, 165, 250, 0.6) 100%);
}
</style>