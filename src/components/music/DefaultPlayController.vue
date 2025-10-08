<template>
  <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 fixed bottom-0 left-0 right-0 z-[100]">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- 左侧：默认信息 -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <MusicIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-sm text-gray-500 dark:text-gray-400 truncate">未播放歌曲</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 truncate">选择一首歌曲开始播放</div>
          </div>
        </div>

        <!-- 中间：禁用的播放控制 -->
        <div class="flex-1 max-w-2xl mx-8 opacity-50">
          <div class="flex items-center justify-center gap-4 mb-2">
            <ProButton type="ghost" size="sm" :icon="Repeat" :disabled="true" />
            <div class="flex items-center gap-2">
              <ProButton type="ghost" size="sm" :icon="SkipBack" :disabled="true" />
              <ProButton type="primary" size="sm" :icon="Play" :disabled="true" circle />
              <ProButton type="ghost" size="sm" :icon="SkipForward" :disabled="true" />
            </div>
            <ProButton type="ghost" size="sm" :icon="Volume2" :disabled="true" />
          </div>
          <ProgressBar :current="0" :total="100" :disabled="true" class="m-0" />
        </div>

        <!-- 右侧：默认音质选择 -->
        <div class="flex-1 flex justify-end items-center opacity-50">
          <span class="text-xs text-gray-400 dark:text-gray-500 mr-3">未选择</span>
          <SearchSelect v-model="selectedBr" :options="[]" size="sm" :disabled="true" placeholder="无" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Repeat, SkipBack, SkipForward, Volume2, Music } from 'lucide-vue-next'
import ProgressBar from '@/components/common/ProgressBar.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import ProButton from '@/components/common/proButton.vue'
import { ref } from 'vue'
const selectedBr = ref('')
const MusicIcon = Music
</script>