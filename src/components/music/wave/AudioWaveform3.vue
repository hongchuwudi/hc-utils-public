<template>
  <canvas
      ref="waveformCanvas"
      class="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
      :class="isPlaying ? 'opacity-60' : 'opacity-20'"
      :style="{ zIndex: 0 }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  isPlaying?: boolean
  audioElement?: HTMLAudioElement | null
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
  audioElement: null
})

const waveformCanvas = ref<HTMLCanvasElement>()
let animationFrameId: number | null = null
let updateCanvasSizeFn: (() => void) | null = null
let lastHeartbeatTime = 0
let heartbeatInterval = 600 // 0.6秒一次心跳

// 创建密集心跳波形数据
const createHeartbeatData = () => {
  const points = 300 // 更多点数让波形更密集
  const data = []
  const currentTime = Date.now()

  // 计算心跳
  const timeSinceLastBeat = currentTime - lastHeartbeatTime
  if (timeSinceLastBeat > heartbeatInterval && props.isPlaying) {
    lastHeartbeatTime = currentTime
    // 0.5-0.75秒一次心跳
    heartbeatInterval = 500 + Math.random() * 250
  }

  const time = currentTime * 0.002

  for (let i = 0; i < points; i++) {
    const x = i / points
    let amplitude = 0

    if (props.isPlaying) {
      // 密集的波形，整条线都有
      const wave1 = Math.sin(x * 25 + time) * 0.6
      const wave2 = Math.sin(x * 12 + time * 1.3) * 0.4
      const wave3 = Math.sin(x * 6 + time * 0.8) * 0.3
      const wave4 = Math.sin(x * 40 + time * 2.1) * 0.2

      amplitude = wave1 + wave2 + wave3 + wave4

      // 心跳峰值
      const beatPos = (x * 8 + time * 2) % 1
      if (beatPos < 0.2) {
        const beat = Math.sin(beatPos * Math.PI * 5) * 0.8
        amplitude += beat * (Math.random() > 0.5 ? 1 : -1)
      }

      // 随机噪声
      amplitude += (Math.random() - 0.5) * 0.3

    } else {
      // 暂停时只有微小波动
      amplitude = Math.sin(x * 4 + time) * 0.1
    }

    data.push(amplitude)
  }

  return data
}

// 获取主题适配的颜色
const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains('dark')

  if (isDark) {
    return {
      // 深色主题 - 使用柔和的绿色
      primary: 'rgba(74, 222, 128, 0.4)',      // 亮绿色
      secondary: 'rgba(34, 197, 94, 0.3)',     // 中等绿色
      baseline: 'rgba(74, 222, 128, 0.2)'      // 淡绿色基线
    }
  } else {
    return {
      // 浅色主题 - 使用深一点的绿色
      primary: 'rgba(21, 128, 61, 0.21)',       // 深绿色
      secondary: 'rgba(34, 197, 94, 0.15)',     // 中等绿色
      baseline: 'rgba(21, 128, 61, 0.035)'      // 淡绿色基线
    }
  }
}

const initWaveform = () => {
  if (!waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  updateCanvasSizeFn = () => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }

  updateCanvasSizeFn()
  window.addEventListener('resize', updateCanvasSizeFn)

  drawWaveform()
}

// 绘制心电图
const drawWaveform = () => {
  if (!waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')!

  const draw = () => {
    animationFrameId = requestAnimationFrame(draw)

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height
    const heartbeatData = createHeartbeatData()
    const centerY = height / 2
    const colors = getThemeColors()

    // 绘制基线
    ctx.beginPath()
    ctx.strokeStyle = colors.baseline
    ctx.lineWidth = 1
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // 绘制主波形线
    ctx.beginPath()
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const sliceWidth = width / (heartbeatData.length - 1)
    let x = 0

    for (let i = 0; i < heartbeatData.length; i++) {
      const amplitude = heartbeatData[i]
      // 限制波形高度不超过歌词区域（约屏幕高度的1/3）
      const maxAmplitude = height * 0.15
      const y = centerY - (Number(amplitude) * maxAmplitude)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    ctx.stroke()

    // 绘制辅助波形线（增加层次感）
    ctx.beginPath()
    ctx.strokeStyle = colors.secondary
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6

    x = 0
    for (let i = 0; i < heartbeatData.length; i++) {
      const amplitude = Number(heartbeatData[i]) * 0.7 // 稍小的振幅
      const maxAmplitude = height * 0.15
      const y = centerY - (amplitude * maxAmplitude)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      x += sliceWidth
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  draw()
}

const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (updateCanvasSizeFn) {
    window.removeEventListener('resize', updateCanvasSizeFn)
    updateCanvasSizeFn = null
  }
}

watch(() => props.isPlaying, (isPlaying) => {
  if (isPlaying) {
    lastHeartbeatTime = Date.now()
  }
})

onMounted(() => {
  nextTick(() => {
    initWaveform()
  })
})

onUnmounted(() => {
  cleanup()
})
</script>