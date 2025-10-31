<template>
  <div class="download-quality-select z-[100]">
    <!-- 模态框 -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" @click="handleBackdropClick">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
        <!-- 标题栏 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <Headphones class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              选择下载音质
            </h3>
          </div>
          <button
              @click="closeModal"
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 歌曲信息 -->
          <div v-if="currentSong" class="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-3">
              <img
                  v-if="currentSong.cover"
                  :src="currentSong.cover"
                  alt="Cover"
                  class="w-10 h-10 rounded object-cover"
              />
              <div v-else class="w-10 h-10 rounded bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <Music class="w-5 h-5 text-gray-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm truncate text-blue-800 dark:text-blue-200">
                  {{ currentSong.title }}
                </div>
                <div class="text-xs text-blue-600 dark:text-blue-400 truncate">
                  {{ currentSong.singer }}
                </div>
              </div>
            </div>
          </div>

          <!-- 音质选择 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-4">
              <Settings class="w-4 h-4 text-blue-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                选择下载音质
              </span>
            </div>

            <div class="space-y-2">
              <div
                  v-for="option in qualityOptions"
                  :key="option.value"
                  class="flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200"
                  :class="[
                    selectedQuality === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  ]"
                  @click="selectedQuality = option.value"
              >
                <div class="flex items-center gap-3">
                  <div
                      class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      :class="[
                        selectedQuality === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400 dark:border-gray-500'
                      ]"
                  >
                    <div
                        v-if="selectedQuality === option.value"
                        class="w-1.5 h-1.5 rounded-full bg-white"
                    ></div>
                  </div>
                  <span
                      class="font-medium"
                      :class="[
                        selectedQuality === option.value
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      ]"
                  >
                    {{ option.label }}
                  </span>
                </div>
                <span
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="[
                      selectedQuality === option.value
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    ]"
                >
                  {{ option.value }}
                </span>
              </div>
            </div>
          </div>

          <!-- 当前选择提示 -->
          <div
              v-if="selectedQuality"
              class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-sm text-green-700 dark:text-green-300">
                已选择: <strong>{{ getQualityLabel(selectedQuality) }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
              @click="confirmDownload"
              :disabled="!selectedQuality"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
          >
            开始下载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Headphones, X, Settings, CheckCircle, Music } from 'lucide-vue-next'
import {usePlayerStore} from "../../stores/playerStore.ts";
import type { UnifiedMusicItem } from '../../types/music/music.ts'

interface QualityOption {
  value: string
  label: string
}

interface Emits {
  (e: 'confirm', quality: string): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const showModal = ref(false)
const selectedQuality = ref('')
const currentSong = ref<UnifiedMusicItem | null>(null)
const currentSource = ref<'qq' | 'wyy' | 'kw' | 'qishui'>('qq')
const playerStore = usePlayerStore()

// 当前音质选项
const qualityOptions = computed<QualityOption[]>(() => playerStore.brOptionsConfig[currentSource.value] || [])

// 打开模态框
const openModal = (song: UnifiedMusicItem, source: 'qq' | 'wyy' | 'kw' | 'qishui') => {
  currentSong.value = song
  currentSource.value = source
  selectedQuality.value = playerStore.defaultBrConfig[source] || ''
  showModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  emit('cancel')
}

// 确认下载
const confirmDownload = () => {
  if (selectedQuality.value) {
    emit('confirm', selectedQuality.value)
    showModal.value = false
  }
}

// 获取音质标签
const getQualityLabel = (value: string): string => {
  const option = qualityOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}

// 点击模态框外部关闭
const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('bg-opacity-50')) {
    closeModal()
  }
}

// 暴露方法给父组件
defineExpose({
  openModal
})
</script>

<style scoped>
.download-quality-select {
  display: inline-block;
}

/* 模态框动画 */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-opacity-50 {
  backdrop-filter: blur(4px);
}
</style>