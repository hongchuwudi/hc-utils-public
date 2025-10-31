<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">视频URL:</label>
        <input
            v-model="videoUrl"
            class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">音频URL:</label>
        <input
            v-model="audioUrl"
            class="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button @click="togglePlay" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
        {{ isPlaying ? '暂停' : '播放' }}
      </button>
    </div>

    <div class="bg-black rounded-lg overflow-hidden">
      <video
          ref="videoRef"
          :src="currentVideo"
          controls
          class="w-full max-h-[70vh]"
          @play="handleVideoPlay"
          @pause="handleVideoPause"
      />
    </div>

    <audio
        ref="audioRef"
        :src="currentAudio"
        class="hidden"
        @play="handleAudioPlay"
        @pause="handleAudioPause"
    />
    <div class="mt-4 p-4 bg-yellow-100 rounded">
      <p class="font-medium">同步状态: {{ syncStatus }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 保持你原来的URL
const videoUrl = ref('https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/94/53/1080025394/1080025394-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&gen=playurlv3&os=cosbv&uipk=5&oi=606639003&platform=pc&og=cos&mid=1785017192&deadline=1760374488&trid=72c160c9c7354143810e6d358fe16c8u&nbs=1&upsig=b3645c339e749b1dc91d639bc484ef84&uparams=e,gen,os,uipk,oi,platform,og,mid,deadline,trid,nbs&bvc=vod&nettype=0&bw=2647157&agrr=0&buvid=&build=0&dl=0&f=u_0_0&orderid=0,3')
const audioUrl = ref('https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/94/53/1080025394/1080025394-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&trid=72c160c9c7354143810e6d358fe16c8u&nbs=1&gen=playurlv3&os=cosbv&deadline=1760374488&uipk=5&og=cos&oi=606639003&mid=1785017192&platform=pc&upsig=cde468a3c379f1835e401c08e97d6a38&uparams=e,trid,nbs,gen,os,deadline,uipk,og,oi,mid,platform&bvc=vod&nettype=0&bw=211648&agrr=0&buvid=&build=0&dl=0&f=u_0_0&orderid=0,3')

const currentVideo = ref('')
const currentAudio = ref('')
const videoRef = ref<HTMLVideoElement>()
const audioRef = ref<HTMLAudioElement>()
const syncStatus = ref('等待播放')
const isPlaying = ref(false)

let syncInterval: number

// 统一播放函数
const playBoth = async () => {
  if (!videoRef.value || !audioRef.value) return

  try {
    // 同步时间
    audioRef.value.currentTime = videoRef.value.currentTime

    // 播放视频
    await videoRef.value.play()

    // 播放音频
    await audioRef.value.play()

    isPlaying.value = true
    syncStatus.value = '播放中'
    startSync()
  } catch (error) {
    console.error('播放失败:', error)
  }
}

// 统一暂停函数
const pauseBoth = () => {
  videoRef.value?.pause()
  audioRef.value?.pause()
  isPlaying.value = false
  syncStatus.value = '已暂停'
  clearInterval(syncInterval)
}

// 切换播放/暂停
const togglePlay = () => {
  if (isPlaying.value) {
    pauseBoth()
  } else {
    // 首次播放设置URL
    if (!currentVideo.value) {
      currentVideo.value = videoUrl.value
      currentAudio.value = audioUrl.value
      setTimeout(() => playBoth(), 100)
    } else {
      playBoth()
    }
  }
}

// 视频播放事件
const handleVideoPlay = () => {
  if (!isPlaying.value) {
    playBoth()
  }
}

// 视频暂停事件
const handleVideoPause = () => {
  if (isPlaying.value) {
    pauseBoth()
  }
}

// 音频播放事件
const handleAudioPlay = () => {
  syncStatus.value = '音频播放中'
}

// 音频暂停事件
const handleAudioPause = () => {
  // 音频暂停时不做处理，由视频控制
}

// 同步循环
const startSync = () => {
  clearInterval(syncInterval)

  syncInterval = setInterval(() => {
    if (videoRef.value && audioRef.value && isPlaying.value) {
      const videoTime = videoRef.value.currentTime
      const audioTime = audioRef.value.currentTime

      if (Math.abs(videoTime - audioTime) > 0.1) {
        audioRef.value.currentTime = videoTime
      }
    }
  }, 100)
}

// 处理页面可见性变化（切屏）
const handleVisibilityChange = () => {
  if (document.hidden && isPlaying.value) {
    pauseBoth()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearInterval(syncInterval)
})
</script>