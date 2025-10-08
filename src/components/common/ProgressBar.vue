<template>
  <div
      class="relative flex items-center group"
      :class="[className, vertical ? 'flex-col' : 'flex-row']"
      ref="container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
  >
    <span v-if="showTime && !vertical" class="text-xs text-gray-500 dark:text-gray-400 w-8 tabular-nums flex-shrink-0">
      {{ formatTime(current) }}
    </span>

    <!-- 原生进度条 -->
    <div
        class="relative cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
        :class="vertical ? 'w-2 h-24' : 'h-2 w-full'"
        @mousedown="handleMouseDown"
        @click="handleClick"
        ref="progressBar"
    >
      <!-- 进度背景 -->
      <div
          class="absolute bg-blue-500 rounded-full transition-all duration-200"
          :class="vertical ? 'w-full bottom-0' : 'h-full left-0'"
          :style="vertical
          ? { height: percentage + '%' }
          : { width: percentage + '%' }"
      ></div>

      <!-- 拖动点 -->
      <div
          v-if="showHoverDot"
          class="absolute bg-blue-500 rounded-full shadow-lg border-2 border-white dark:border-gray-900 z-10 transition-transform duration-150"
          :class="[
          vertical
            ? 'w-4 h-4 left-1/2 transform -translate-x-1/2'
            : 'w-4 h-4 top-1/2 transform -translate-y-1/2',
          isDragging ? 'scale-125' : 'scale-100'
        ]"
          :style="vertical
          ? { bottom: hoverPercentage + '%', transform: 'translate(-50%, 50%)' + (isDragging ? ' scale(1.25)' : '') }
          : { left: hoverPercentage + '%', transform: 'translate(-50%, -50%)' + (isDragging ? ' scale(1.25)' : '') }"
      ></div>

      <!-- 悬浮提示 -->
      <div
          v-if="showTooltip && (isHovering || isDragging)"
          class="absolute px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg z-20 transition-opacity duration-200"
          :class="[
            vertical
              ? 'left-full ml-2 top-1/2 transform -translate-y-1/2'
              : 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
          ]"
          :style="vertical
          ? { bottom: hoverPercentage + '%', top: 'auto' }
          : { left: hoverPercentage + '%' }"
      >
        {{ formatTime(hoverTime) }}
        <div
            class="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"
            :class="[
              vertical
                ? 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2'
            ]"
        ></div>
      </div>
    </div>

    <span v-if="showTime && !vertical" class="text-xs text-gray-500 dark:text-gray-400 w-8 tabular-nums flex-shrink-0">
      {{ formatTime(total) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Props {
  current: number
  total: number
  showTime?: boolean
  showTooltip?: boolean
  className?: string
  vertical?: boolean
  verticalType?: 'time' | 'number' | 'percent' | 'rate' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  showTime: true,
  showTooltip: true,
  className: '',
  vertical: false,
  verticalType: 'time'
})

const emit = defineEmits<{
  'update:current': [value: number]
  'seek': [value: number]
}>()

const container = ref<HTMLElement>()
const progressBar = ref<HTMLElement>()
const isHovering = ref(false)
const isDragging = ref(false)
const hoverPosition = ref(0)

const percentage = computed(() => {
  return props.total > 0 ? Math.min(100, (props.current / props.total) * 100) : 0
})

const hoverPercentage = computed(() => {
  return Math.max(0, Math.min(100, hoverPosition.value))
})

const hoverTime = computed(() => {
  return (hoverPercentage.value / 100) * props.total
})

const showHoverDot = computed(() => {
  return isHovering.value || isDragging.value
})

// 鼠标悬停处理
const handleMouseEnter = () => {
  isHovering.value = true
  hoverPosition.value = percentage.value
}

const handleMouseLeave = () => {
  isHovering.value = false
  if (!isDragging.value) {
    hoverPosition.value = 0
  }
}

const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  handleInteraction(event)

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      handleInteraction(e)
    }
  }

  const handleGlobalMouseUp = (e: MouseEvent) => {
    if (isDragging.value) {
      // 拖动结束时触发一次 seek
      const finalTime = getTimeFromEvent(e)
      emit('seek', finalTime)
    }

    isDragging.value = false
    isHovering.value = false
    hoverPosition.value = 0

    document.removeEventListener('mousemove', handleGlobalMouseMove)
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
  event.preventDefault()
}

const handleClick = (event: MouseEvent) => {
  // 如果不是拖动操作，处理点击
  if (!isDragging.value) {
    const clickTime = getTimeFromEvent(event)
    emit('update:current', clickTime)
    emit('seek', clickTime)
  }
}

// 交互处理
const handleInteraction = (event: MouseEvent) => {
  if (!progressBar.value) return

  const newTime = getTimeFromEvent(event)

  // 更新悬停位置
  const rect = progressBar.value.getBoundingClientRect()
  let relativePos: number

  if (props.vertical) {
    const mouseY = event.clientY
    const relativeY = rect.bottom - mouseY
    relativePos = Math.max(0, Math.min(1, relativeY / rect.height))
  } else {
    const mouseX = event.clientX - rect.left
    relativePos = Math.max(0, Math.min(1, mouseX / rect.width))
  }

  hoverPosition.value = relativePos * 100

  // 只更新视觉进度，不触发 seek
  emit('update:current', newTime)
}

// 从鼠标事件获取时间
const getTimeFromEvent = (event: MouseEvent): number => {
  if (!progressBar.value) return props.current

  const rect = progressBar.value.getBoundingClientRect()
  let relativePos: number

  if (props.vertical) {
    const mouseY = event.clientY
    const relativeY = rect.bottom - mouseY
    relativePos = Math.max(0, Math.min(1, relativeY / rect.height))
  } else {
    const mouseX = event.clientX - rect.left
    relativePos = Math.max(0, Math.min(1, mouseX / rect.width))
  }

  return relativePos * props.total
}

const formatTime = (seconds: number) => {
  if (props.verticalType === 'number') return seconds.toString()
  if (props.verticalType === 'percent') return `${Math.round((seconds / props.total) * 100)}%`
  if (props.verticalType === 'rate') {
    const rate = (seconds / 100) + 0.1               // 转换为实际的倍速率
    return rate.toFixed(2) + 'x'        // 这样就会显示 0.5x, 1.0x, 1.5x 等
  }
  // 默认时间格式
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  document.removeEventListener('mousemove', () => {})
  document.removeEventListener('mouseup', () => {})
})
</script>