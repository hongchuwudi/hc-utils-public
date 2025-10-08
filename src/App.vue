<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 app-container scrollbar-hidden" data-hide-scrollbar="true">
    <AppHeader @toggle-collapse="handleHeaderCollapse" />
    <main :class="{ 'pt-14': !isHeaderCollapsed }">
      <router-view :is-header-collapsed="isHeaderCollapsed"/>
    </main>
    <!-- 全局音频元素 -->
    <audio
        ref="globalAudioPlayer"
        @timeupdate="playerStore.handleTimeUpdate"
        @loadedmetadata="playerStore.handleLoadedMetadata"
        @ended="playerStore.handleSongEnd"
        @error="playerStore.handleAudioError"
        class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { useTheme } from './composables/useTheme'
import { usePlayerStore } from './stores/playerStore.ts'
import { onMounted, ref } from 'vue'
const { initTheme } = useTheme()
const isHeaderCollapsed = ref(true)
const globalAudioPlayer = ref<HTMLAudioElement>()
const playerStore = usePlayerStore()
const handleHeaderCollapse = (collapsed: boolean) => isHeaderCollapsed.value = collapsed
onMounted(() => {
  initTheme()
  // 初始化全局音频元素
  if (globalAudioPlayer.value) playerStore.initAudioElement(globalAudioPlayer.value)
})
</script>

<style scoped>

.app-container {
  position: relative;
}
main.pt-14 {
  padding-top: 3.5rem;
}
.hidden {
  display: none;
}
</style>