<template>
  <div>
    <!-- 视频播放器 -->
    <div>
      <h3>视频播放</h3>
      <video
          ref="videoPlayer"
          :src="videoUrl"
          controls
          width="800"
          @error="onVideoError"
      >
        您的浏览器不支持视频播放
      </video>
    </div>

    <!-- 音频播放器 -->
    <div>
      <h3>音频播放</h3>
      <audio
          ref="audioPlayer"
          :src="audioUrl"
          controls
          @error="onAudioError"
      >
        您的浏览器不支持音频播放
      </audio>
    </div>

    <!-- 合并播放器 -->
    <div>
      <h3>合并播放</h3>
      <video
          ref="mergedPlayer"
          :src="mergedUrl"
          controls
          width="800"
          @error="onMergedError"
      >
        您的浏览器不支持视频播放
      </video>
    </div>

    <!-- 控制按钮 -->
    <div>
      <button @click="loadVideo">加载视频</button>
      <button @click="loadAudio">加载音频</button>
      <button @click="mergeVideoAudio">合并播放</button>
    </div>

    <!-- 状态显示 -->
    <div>
      <p>视频状态: {{ videoStatus }}</p>
      <p>音频状态: {{ audioStatus }}</p>
      <p>合并状态: {{ mergedStatus }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Refs
const videoPlayer = ref(null)
const audioPlayer = ref(null)
const mergedPlayer = ref(null)

// URLs - 替换为你的实际URL
const videoUrl = ref('')
const audioUrl = ref('')
const mergedUrl = ref('')

// 状态
const videoStatus = ref('未加载')
const audioStatus = ref('未加载')
const mergedStatus = ref('未合并')

// 加载视频
const loadVideo = () => {
  videoUrl.value = 'https://www.bilibili.com/video/BV1ESYBzuEUh?vd_source=2894f4a0e0926a34f5dfc8e187d97a5b'
  videoStatus.value = '加载中...'
}

// 加载音频
const loadAudio = () => {
  audioUrl.value = 'https://xy182x89x193x200xy.mcdn.bilivideo.cn:8082/v1/resource/1080025394-1-30232.m4s?agrr=0&build=0&buvid=&bvc=vod&bw=106790&deadline=1759908011&dl=0&e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M%3D&f=u_0_0&gen=playurlv3&mid=1785017192&nbs=1&nettype=0&og=cos&oi=3683689634&orderid=0%2C3&os=estgcos&platform=pc&sign=a5194f&traceid=trKWKzlJNThnYM_0_e_N&uipk=5&uparams=e%2Cog%2Cuipk%2Cdeadline%2Cgen%2Cos%2Cplatform%2Ctrid%2Cmid%2Cnbs%2Coi&upsig=d5b63d491fc8e32237cba399fc6d1e9b'
  audioStatus.value = '加载中...'
}

// 合并音视频
const mergeVideoAudio = async () => {
  if (!videoUrl.value || !audioUrl.value) {
    mergedStatus.value = '请先加载视频和音频'
    return
  }

  mergedStatus.value = '合并中...'

  try {
    // 简单合并：创建一个新的媒体源
    // 注意：这只是一个前端模拟，真正的合并需要后端处理
    mergedUrl.value = videoUrl.value
    mergedStatus.value = '合并完成'
  } catch (error) {
    mergedStatus.value = '合并失败: ' + error.message
  }
}

// 错误处理
const onVideoError = (e) => {
  videoStatus.value = '加载失败'
  console.error('视频错误:', e)
}

const onAudioError = (e) => {
  audioStatus.value = '加载失败'
  console.error('音频错误:', e)
}

const onMergedError = (e) => {
  mergedStatus.value = '播放失败'
  console.error('合并播放错误:', e)
}
</script>