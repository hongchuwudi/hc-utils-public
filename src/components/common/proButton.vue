<template>
  <div class="relative inline-flex">
    <button
        :class="buttonClasses"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
    >
      <!-- 图标 -->
      <component :is="icon" v-if="icon" :class="iconSizeClasses" />

      <!-- 文字（可选） -->
      <span v-if="showText" class="ml-2">
        <slot>{{ text }}</slot>
      </span>

      <!-- 加载状态 -->
      <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </button>

    <!-- 悬浮提示（只在hover时显示） -->
    <transition name="tooltip-fade">
      <div
          v-if="tooltip && showTooltip"
          class="absolute z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-xl whitespace-nowrap"
          :class="tooltipPositionClasses"
      >
        {{ tooltip }}
        <div class="absolute w-2 h-2 bg-inherit transform rotate-45" :class="tooltipArrowClasses"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const showTooltip = ref(false) // 控制tooltip显示
interface Props {
  type?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'favorite'
  size?: 'sm' | 'md' | 'lg'
  icon?: any
  text?: string
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom'
  loading?: boolean
  disabled?: boolean
  circle?: boolean
  showText?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'icon',
  size: 'md',
  tooltipPosition: 'top',
  circle: true,
  showText: false
})

const iconSizeClasses = computed(() => {
  return {
    'sm': 'w-5 h-5',
    'md': 'w-6 h-6',
    'lg': 'w-7 h-7'
  }[props.size]
})

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

  // 形状
  props.circle ? 'rounded-full' : 'rounded-lg',

  // // // 焦点状态
  // props.circle
  //     ? 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:!rounded-full'
  //     : 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',

  // 类型
  props.type === 'primary' && 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 ',
  props.type === 'secondary' && 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600',
  props.type === 'ghost' && 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent',
  props.type === 'icon' && 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm',
  props.type === 'favorite' && 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent', // 新增 favorite 类型，没有固定文字颜色
  // 尺寸
  props.size === 'sm' && (props.circle ? 'w-8 h-8' : 'px-3 py-1.5 text-sm'),
  props.size === 'md' && (props.circle ? 'w-10 h-10' : 'px-4 py-2'),
  props.size === 'lg' && (props.circle ? 'w-12 h-12' : 'px-6 py-3 text-lg'),

  // 状态
  props.loading && 'opacity-70 cursor-not-allowed',
  props.disabled && 'opacity-50 cursor-not-allowed',
])

const tooltipPositionClasses = computed(() => {
  switch (props.tooltipPosition) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2'
    default:
      return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2'
  }
})

const tooltipArrowClasses = computed(() => {
  switch (props.tooltipPosition) {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1 rotate-45'
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 rotate-45'
    default:
      return 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 rotate-45'
  }
})
</script>

<style scoped>
/* 强制圆形焦点阴影 */
button:focus {
  border-radius: 9999px !important;
}
</style>