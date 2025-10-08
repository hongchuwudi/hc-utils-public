<!-- BottomPlayer.vue -->
<template>
  <div v-if="currentSong" class="bg-white/20 dark:bg-gray-800/20 border-t border-gray-200/30 dark:border-gray-700/30 px-4 py-3 fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-sm">
    <div class="max-w-8xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- 左侧：歌曲信息 -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- 歌曲封面 -->
          <div class="w-10 h-10 flex-shrink-0 cursor-pointer" @click="handleCoverClick">
            <img
                v-if="currentSong.cover"
                :src="currentSong.cover"
                alt="Cover"
                class="w-full h-full rounded-full object-cover transition-transform duration-300"
                :class="{ 'animate-spin': isPlaying }"
                :style="{ animationDuration: '10s' }"
            />
            <img
                v-else
                src="https://pic2.zhimg.com/v2-2d44b34343fadb3f01872fa244580bc1_r.jpg"
                alt="Cover"
                class="w-full h-full rounded-full object-cover transition-transform duration-300"
                :class="{ 'animate-spin': isPlaying }"
                :style="{ animationDuration: '10s' }"
            />
          </div>

          <!-- 歌曲信息 -->
          <div class="min-w-0 flex-1">
            <div class="font-medium text-sm truncate">{{ currentSong.title }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ currentSong.singer }}</div>
          </div>
        </div>

        <!-- 中间：播放控制 -->
        <div class="flex-1 max-w-2xl mx-8">
          <!-- 播放控制按钮 -->
          <div class="flex items-center justify-center gap-4 mb-2">
            <!-- 播放模式 -->
            <ProButton
                type="ghost"
                size="sm"
                :icon="playModeIcon"
                @click="changePlayMode"
                :tooltip="playModeText"
                tooltip-position="top"
            />

            <!-- 播放控制 -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="SkipBack"
                  @click="playPrevious"
                  tooltip="上一首"
                  tooltip-position="top"
              />
              <ProButton
                  type="primary"
                  size="sm"
                  :icon="isPlaying ? Pause : Play"
                  @click="togglePlay"
                  :tooltip="isPlaying ? '暂停' : '播放'"
                  tooltip-position="top"
                  circle
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="SkipForward"
                  @click="playNext"
                  tooltip="下一首"
                  tooltip-position="top"
              />
            </div>

            <!-- 音量控制 -->
            <div class="relative flex items-center group">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="volumeIcon"
                  @click="toggleMute"
                  :tooltip="isMuted ? '取消静音' : '静音'"
                  tooltip-position="top"
              />
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                <ProgressBar
                    :current="volume * 100"
                    :total="100"
                    :vertical="true"
                    :show-time="false"
                    :debounce-delay="100"
                    vertical-type="percent"
                    @update:current="setVolumeFromProgress"
                />
              </div>
            </div>
          </div>

          <!-- 播放进度条 -->
          <div class="w-full">
            <ProgressBar
                :current="currentTime"
                :total="duration"
                :debounce-delay="100"
                @update:current="seekAudio"
                class="m-0"
            />
          </div>
        </div>

        <!-- 右侧：音质选择 -->
        <div class="flex-1 flex justify-end items-center">
          <!-- 播放列表模式和来源单行显示，用竖线分隔 -->
          <div class="flex items-center mr-3">
            <span class="text-xs text-gray-400 dark:text-gray-400 capitalize">
              {{ usePlayerStore().playListModelText }}
            </span>
            <span class="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <span class="text-xs text-gray-400 dark:text-gray-400 capitalize">
              {{ currentSong.source }}
            </span>
          </div>

          <!-- 新增收藏按钮 -->
          <ProButton
              v-if="currentSong"
              type="favorite"
              size="sm"
              :icon="isFavorite ? HeartSolid : HeartOutline"
              @click="handleToggleFavorite"
              :tooltip="isFavorite ? '取消收藏' : '收藏'"
              tooltip-position="top"
              class="mr-1"
              :class="[
                isFavorite
                ? 'text-red-500 hover:text-red-600 [&_svg]:fill-red-500 [&_svg]:text-red-500'
                : 'text-gray-600 dark:text-gray-400 [&_svg]:fill-none'
              ]"
          />

          <!-- 倍速控制 -->
          <PlaybackRateSlider
              class="mr-2"
              :model-value="playbackRateValue"
              @update:modelValue="handlePlaybackRateChange"
          />

          <div v-if="usePlayerStore().currentListMode === 'search'">
          <SearchSelect
              :model-value="selectedBr"
              :options="brOptions"
              size="sm"
              placement="top"
              @update:model-value="(value: string) => $emit('update:selectedBr', value)"
          />
          <span v-if="isBrChanging" class="loading-text">切换中...</span>
          </div>
          <div v-else>
            <SearchSelect
                :model-value="'默认'"
                :options="[{ value: '默认', label: '默认' }]"
                size="sm"
                placement="top"
                @update:model-value="(value: string) => $emit('update:selectedBr', value)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <DefaultPlayController v-else />
</template>

<script setup lang="ts">
import ProButton from '@/components/common/proButton.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import DefaultPlayController from '@/components/music/DefaultPlayController.vue'
import { computed } from 'vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, Shuffle, Heart as HeartSolid, HeartOff as HeartOutline  } from 'lucide-vue-next'
import type { UnifiedMusicItem } from '../../api/music.ts'
import {usePlayerStore} from "../../stores/playerStore.ts";
import PlaybackRateSlider from "@/components/music/PlaybackRateSlider.vue";

// Props
interface Props {
  currentSong?: UnifiedMusicItem | null
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  volume?: number
  isMuted?: boolean
  playMode?: string
  selectedBr?: string
  brOptions?: Array<{ value: string; label: string }>,
  isBrChanging?: boolean
  isFavorite?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  playMode: 'sequence',
  selectedBr: '',
  isBrChanging: false,
  brOptions: () => []
})
const emit = defineEmits<{
  'update:selectedBr': [value: string]
  'cover-click': []
  'toggle-play': []
  'play-previous': []
  'play-next': []
  'change-play-mode': []
  'toggle-mute': []
  'set-volume': [value: number]
  'seek-audio': [time: number]
  'toggle-favorite': []
}>()
const playerStore = usePlayerStore()
const volumeIcon = computed(() => (props.isMuted || props.volume === 0) ? VolumeX : Volume2)
const playModeIcon = computed(() => {
  switch (props.playMode) {
    case 'single': return Repeat1
    case 'random': return Shuffle
    default: return Repeat
  }
})
const playModeText = computed(() => {
  switch (props.playMode) {
    case 'single': return '单曲循环'
    case 'random': return '随机播放'
    default: return '顺序播放'
  }
})
const playbackRateValue = computed(() => playerStore.playbackRate || 1.0)

// 处理倍速率变化
const handlePlaybackRateChange = (rate: number) =>  playerStore.setPlaybackRate(rate)
const handleCoverClick = () => emit('cover-click')
const togglePlay = () => emit('toggle-play')
const playPrevious = () => emit('play-previous')
const playNext = () => emit('play-next')
const changePlayMode = () => emit('change-play-mode')
const toggleMute = () => emit('toggle-mute')
const setVolumeFromProgress = (value: number) => emit('set-volume', value)
const seekAudio = (time: number) => emit('seek-audio', time)
const handleToggleFavorite = () => emit('toggle-favorite')
</script>

<style scoped>
.animate-spin {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>