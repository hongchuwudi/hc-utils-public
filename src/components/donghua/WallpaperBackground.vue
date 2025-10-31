<!-- WallpaperBackground.vue -->
<template>
  <div class="wallpaper-background">
    <!-- 图片壁纸 -->
    <img
        v-if="currentWallpaper?.type === 'image'"
        :src="currentWallpaper.path"
        class="wallpaper-media"
        @load="handleLoad"
        @error="handleError"
    />

    <!-- 视频壁纸 -->
    <video
        v-else-if="currentWallpaper?.type === 'video'"
        ref="videoElement"
        :src="currentWallpaper.path"
        class="wallpaper-media"
        autoplay
        loop
        @loadeddata="handleVideoLoad"
        @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWallpaperStore } from '../../stores/wallpaperStore'

const wallpaperStore = useWallpaperStore()
const currentWallpaper = computed(() => wallpaperStore.currentWallpaper)
const videoVolume = computed(() => wallpaperStore.videoVolume)
const videoElement = ref<HTMLVideoElement | null>(null)
const videoProgress = computed(() => wallpaperStore.videoProgress)
const shouldSetProgress = ref(false)

// 监听音量变化并应用到视频元素
watch(videoVolume, (newVolume) => {
  if (videoElement.value) {
    console.log('设置视频音量:', newVolume)
    videoElement.value.volume = newVolume
    videoElement.value.muted = newVolume === 0
  }
})

// 监听壁纸切换，确保新视频应用正确音量
watch(currentWallpaper, (newWallpaper) => {
  if (newWallpaper?.type === 'video' && videoElement.value) {
    // 给视频一点时间加载，然后设置音量
    setTimeout(() => {
      if (videoElement.value) {
        videoElement.value.volume = videoVolume.value
        videoElement.value.muted = videoVolume.value === 0
      }
    }, 100)
  }
})

// 设置进度的方法
const setVideoProgress = (progress: number) => {
  if (videoElement.value && videoElement.value.duration) {
    videoElement.value.currentTime = progress * videoElement.value.duration
  }
}
// 监听进度变化，但只在需要时设置
watch(videoProgress, (newProgress) => {
  if (shouldSetProgress.value) {
    setVideoProgress(newProgress)
    shouldSetProgress.value = false
  }
})

const handleVideoLoad = () => {
  console.log('✅ 视频壁纸加载成功')
  // 视频加载后立即设置音量
  if (videoElement.value) {
    videoElement.value.volume = videoVolume.value
    videoElement.value.muted = videoVolume.value === 0
  }
}

// 暴露一个方法给外部调用，用于强制设置进度
const forceSetProgress = (progress: number) => {
  setVideoProgress(progress)
}

const handleLoad = () => console.log('✅ 图片壁纸加载成功')
const handleError = (e: Event) => console.error('❌ 壁纸加载失败:', e)
// 如果需要，可以暴露这个方法给父组件
defineExpose({
  forceSetProgress
})
</script>

<style scoped>
.wallpaper-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wallpaper-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>