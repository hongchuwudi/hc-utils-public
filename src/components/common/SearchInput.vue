<template>
  <div class="search-bar" :class="{ 'search-bar--visible': visible }">
    <div class="relative w-full" :style="{ maxWidth: maxWidth }">
      <!-- 搜索图标 -->
      <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />

      <!-- 搜索输入框 -->
      <input
          ref="inputRef"
          v-model="localQuery"
          type="text"
          :placeholder="placeholder"
          class="search-input"
          :class="inputClasses"
          @keyup.enter="handleSearch"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
      />

      <!-- 清除按钮 -->
      <button
          v-if="showClear && localQuery"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          @click="handleClear"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Search, X } from 'lucide-vue-next'

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  visible?: boolean
  maxWidth?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  showClear?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索...',
  visible: true,
  maxWidth: '320px',
  size: 'md',
  variant: 'default',
  showClear: true,
  autoFocus: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'clear': []
  'focus': []
  'blur': []
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const localQuery = ref(props.modelValue)

// Computed
const inputClasses = computed(() => {
  const baseClasses = [
    'w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-200'
  ]

  // 尺寸样式
  const sizeClasses = {
    sm: 'py-1 text-xs',
    md: 'py-1.5 text-sm',
    lg: 'py-2 text-base'
  }

  // 变体样式
  const variantClasses = {
    default: '',
    filled: 'bg-white dark:bg-gray-800 shadow-sm',
    outlined: 'bg-transparent border-2'
  }

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ')
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  localQuery.value = newValue
})

watch(localQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Methods
const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit('search', localQuery.value.trim())
  }
}

const handleInput = () => {
  // 实时搜索（可选）
  // emit('search', localQuery.value)
}

const handleClear = () => {
  localQuery.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}

const focus = () => {
  inputRef.value?.focus()
}

const clear = () => {
  handleClear()
}

// 自动聚焦
if (props.autoFocus) {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Expose methods
defineExpose({
  focus,
  clear
})
</script>

<style scoped>
.search-bar {
  transition: all 0.3s ease;
}

.search-bar--visible {
  opacity: 1;
  transform: translateX(0);
}

.search-input::placeholder {
  color: #9CA3AF;
}

.dark .search-input::placeholder {
  color: #6B7280;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>