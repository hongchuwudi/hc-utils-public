<template>
  <canvas
      ref="waveformCanvas"
      class="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
      :class="isPlaying ? 'opacity-40' : 'opacity-15'"
  />
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

// 创建更流畅的波形数据
const createWaveformData = () => {
  const points = 150
  const data = []
  const time = Date.now() * 0.0008 // 更慢的速度

  for (let i = 0; i < points; i++) {
    const x = i / points
    let amplitude = 0

    if (props.isPlaying) {
      // 更复杂的波形叠加
      const wave1 = Math.sin(x * 30 + time) * 0.5
      const wave2 = Math.sin(x * 15 + time * 1.7) * 0.35
      const wave3 = Math.sin(x * 8 + time * 0.9) * 0.25
      const wave4 = Math.sin(x * 50 + time * 2.5) * 0.15

      amplitude = 0.25 + wave1 + wave2 + wave3 + wave4

      // 更强的节奏感
      if (Math.random() < 0.04) amplitude += Math.random() * 0.8
    } else
      amplitude = 0.08 + Math.sin(x * 6 + time) * 0.03 // 暂停时更平静

    // 更平滑的包络
    const envelope = Math.sin(x * Math.PI) * Math.sin(x * Math.PI * 0.5)
    amplitude *= envelope

    data.push(Math.max(0.01, Math.min(1, amplitude)))
  }

  return data
}

// 获取主题适配的颜色
const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains('dark')

  if (isDark) {
    // 深色主题 - 使用更暗更淡的颜色
    return {
      primary: 'rgba(147, 197, 253, 0.3)',   // 淡蓝色
      secondary: 'rgba(147, 197, 253, 0.27)', // 更淡的蓝色
      tertiary: 'rgba(147, 197, 253, 0.26)'   // 最淡的蓝色
    }
  } else {
    // 浅色主题
    return {
      // 1:3:2
      primary: 'rgba(59, 130, 246, 0.13)',     // 淡蓝色
      secondary: 'rgba(59, 130, 246, 0.39)',  // 更淡的蓝色
      tertiary: 'rgba(59, 130, 246, 0.26)'    // 最淡的蓝色
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

// 绘制现代风格的波形
const drawWaveform = () => {
  if (!waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')!

  const draw = () => {
    animationFrameId = requestAnimationFrame(draw)

    // 使用完全透明清空，不要拖尾效果
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height
    const waveformData = createWaveformData()
    const centerY = height / 2

    // 获取当前主题的颜色
    const colors = getThemeColors()

    // 绘制多层波形线创造深度感
    for (let layer = 0; layer < 2; layer++) { // 减少到2层
      // const opacityScale = 1 - layer * 0.5
      const scale = 1 - layer * 0.15

      // 上半波形
      ctx.beginPath()
      ctx.strokeStyle = layer === 0 ? colors.primary : colors.secondary
      ctx.lineWidth = 1.5 - layer * 0.5
      ctx.lineCap = 'round'

      const sliceWidth = width / (waveformData.length - 1)
      let x = 0

      for (let i = 0; i < waveformData.length; i++) {
        const amplitude = Number(waveformData[i]) * scale
        const maxAmplitude = height * 0.3 // 降低振幅
        const y = centerY - (amplitude * maxAmplitude)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }
      ctx.stroke()

      // 下半波形
      ctx.beginPath()
      ctx.strokeStyle = layer === 0 ? colors.secondary : colors.tertiary
      ctx.lineWidth = 1.5 - layer * 0.5

      x = 0
      for (let i = 0; i < waveformData.length; i++) {
        const amplitude = Number(waveformData[i]) * scale
        const maxAmplitude = height * 0.3 // 降低振幅
        const y = centerY + (amplitude * maxAmplitude)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }
      ctx.stroke()
    }
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

watch(() => props.isPlaying, () => {
  // 播放状态变化自动更新
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