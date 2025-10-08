<template>
  <canvas
      ref="waveformCanvas"
      class="absolute inset-0 w-full h-full pointer-events-none"
      :style="{ zIndex: 0 }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const waveformCanvas = ref<HTMLCanvasElement>()
let animationFrameId: number

// 可配置参数
const CONFIG = {
  // 心跳控制
  BEAT_INTERVAL: 1820, // 心跳间隔(ms)
  BEAT_DURATION: 1750,  // 心跳动画时长(ms)

  // 视觉效果
  LINE_WIDTH: 2,
  ACTIVE_OPACITY: 0.16,  // 心跳时透明度
  IDLE_OPACITY: 0.16,    // 空闲时透明度
  WAVE_HEIGHT: 0.25,    // 波形高度比例

  // 颜色配置
  COLORS: {
    light: {
      primary: 'rgba(21, 128, 61, {opacity})', // 深绿色
    },
    dark: {
      primary: 'rgba(74, 222, 128, {opacity})', // 亮绿色
    }
  },

  // 心电图波形数据 - 增加波的数量和密度
  ECG_WAVEFORM: [
    // 左边：多个小波
    0, 0.1, 0, -0.1, 0,           // 小波动1
    0.1, 0.2, 0.1, 0, 0,          // P波1
    -0.1, -0.2, 0.4, -0.1, 0,     // QRS波1
    0, 0.1, 0.2, 0.1, 0,          // T波1

    // 中间：中等波
    0, 0, 0.2, 0.3, 0.2, 0,       // P波2
    -0.2, -0.3, 0.6, -0.2, 0,     // QRS波2
    0, 0.2, 0.4, 0.2, 0,          // T波2

    // 右边：大波群
    0, 0.1, 0.3, 0.1, 0,          // P波3
    -0.3, -0.5, 0.9, -0.3, 0,     // QRS波3
    0, 0.3, 0.5, 0.3, 0,          // T波3

    // 最右边：最大波峰
    0, 0.2, 0.4, 0.2, 0,          // P波4
    -0.4, -0.7, 1.1, -0.5, 0,     // 主QRS波（最大峰）
    0, 0.4, 0.7, 0.4, 0,          // T波4
    0, 0, 0, 0, 0                 // 结束平直线
  ]
}

let lastBeatTime = 0  // 上次心跳时间
let isBeating = false // 是否正在心跳
let beatProgress = 0  // 心跳进度(0-1)

//  获取颜色
const getColor = (opacity: number) => {
  const isDark = document.documentElement.classList.contains('dark')
  const colorTemplate = isDark ? CONFIG.COLORS.dark.primary : CONFIG.COLORS.light.primary
  return colorTemplate.replace('{opacity}', opacity.toString())
}
// 更新心跳状态
const updateBeatState = () => {
  const now = Date.now()

  // 心跳计时
  if (now - lastBeatTime > CONFIG.BEAT_INTERVAL && !isBeating) {
    lastBeatTime = now
    isBeating = true
    beatProgress = 0
  }

  // 更新心跳进度
  if (isBeating) {
    beatProgress += 16.7 / CONFIG.BEAT_DURATION
    if (beatProgress >= 1) {
      isBeating = false
      beatProgress = 0
    }
  }
}
// 绘制波形
const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerY = height / 2

  ctx.beginPath()
  ctx.lineWidth = CONFIG.LINE_WIDTH
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (isBeating) {
    // 心跳时：绘制波形
    ctx.strokeStyle = getColor(CONFIG.ACTIVE_OPACITY)

    const visibleWidth = width * beatProgress

    for (let x = 0; x < visibleWidth; x += 2) {
      const wavePos = (x / width) * CONFIG.ECG_WAVEFORM.length
      const index = Math.floor(wavePos)
      const nextIndex = Math.min(index + 1, CONFIG.ECG_WAVEFORM.length - 1)
      const progress = wavePos - index

      const current = CONFIG.ECG_WAVEFORM[index]
      const next = CONFIG.ECG_WAVEFORM[nextIndex]

      if (current !== undefined && next !== undefined) {
        const amplitude = current * (1 - progress) + next * progress
        const y = centerY - (amplitude * height * CONFIG.WAVE_HEIGHT)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

    }
  } else {
    // 不心跳时：平直线
    ctx.strokeStyle = getColor(CONFIG.IDLE_OPACITY)
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
  }

  ctx.stroke()
}

// 主绘制函数
const drawEKG = () => {
  if (!waveformCanvas.value) return

  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')!
  const width = canvas.width
  const height = canvas.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 更新状态
  updateBeatState()

  // 绘制波形
  drawWaveform(ctx, width, height)
}

onMounted(() => {
  const canvas = waveformCanvas.value
  if (!canvas) return
  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }
  resize()
  window.addEventListener('resize', resize)
  const animate = () => {
    drawEKG()
    animationFrameId = requestAnimationFrame(animate)
  }
  animate()
})
onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>