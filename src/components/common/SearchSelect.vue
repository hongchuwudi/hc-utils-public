<!-- components/ProSelect.vue -->
<template>
  <div class="relative" ref="selectContainer">
    <!-- 触发按钮 -->
    <div
        class="pro-select-trigger"
        :class="[triggerClasses, { 'pro-select-open': isOpen, 'pro-select-disabled': disabled }]"
        @click="toggleDropdown"
    >
      <span class="pro-select-selection">
        <span v-if="selectedOption" class="pro-select-selected-value">
          {{ selectedOption.label }}
        </span>
        <span v-else class="pro-select-placeholder">
          {{ placeholder }}
        </span>
      </span>
      <span class="pro-select-arrow">
        <ChevronDown
            class="pro-select-arrow-icon"
            :class="{ 'pro-select-arrow-open': isOpen }"
        />
      </span>
    </div>

    <!-- 下拉菜单 -->
    <transition
        name="pro-select-dropdown"
        @enter="onDropdownEnter"
        @after-enter="onDropdownAfterEnter"
        @leave="onDropdownLeave"
    >
      <div
          v-show="isOpen"
          class="pro-select-dropdown"
          :class="[dropdownClasses, dropdownPosition]"
          :style="dropdownStyle"
      >
        <div class="pro-select-dropdown-inner">
          <div
              v-for="option in options"
              :key="option.value"
              class="pro-select-option"
              :class="[
              {
                'pro-select-option-selected': option.value === modelValue,
                'pro-select-option-focused': focusedIndex === options.indexOf(option)
              }
            ]"
              @click="selectOption(option)"
              @mouseenter="focusedIndex = options.indexOf(option)"
          >
            <span class="pro-select-option-content">{{ option.label }}</span>
            <Check v-if="option.value === modelValue" class="pro-select-option-check" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  placement?: 'bottom' | 'top' | 'auto' // 下拉菜单展开方向
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  size: 'md',
  disabled: false,
  placement: 'bottom' // 默认向下展开
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const isOpen = ref(false)
const focusedIndex = ref(-1)
const selectContainer = ref<HTMLElement>()
const dropdownPosition = ref<'bottom' | 'top' | 'auto'>('bottom')

// 计算选中项
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

// 计算下拉菜单位置
const calculateDropdownPosition = () => {
  if (!selectContainer.value) return 'bottom'

  const rect = selectContainer.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  // 如果下方空间不足且上方空间足够，则向上展开
  if (spaceBelow < 200 && spaceAbove > 200) {
    return 'top'
  }
  return 'bottom'
}

// 样式类
const triggerClasses = computed(() => {
  const base = 'flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 cursor-pointer hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none'

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  }

  const states = {
    open: 'border-blue-500 ring-2 ring-blue-500/20',
    disabled: 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-50'
  }

  return [
    base,
    sizes[props.size],
    isOpen.value && states.open,
    props.disabled && states.disabled
  ]
})

const dropdownClasses = computed(() => {
  return 'absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden'
})

const dropdownStyle = computed(() => {
  if (!selectContainer.value) return {}
  const rect = selectContainer.value.getBoundingClientRect()

  if (dropdownPosition.value === 'top') {
    return {
      minWidth: `${rect.width}px`, // 改为 minWidth
      bottom: '100%',
      left: '0',
      marginBottom: '4px'
    }
  } else {
    return {
      minWidth: `${rect.width}px`, // 改为 minWidth
      top: '100%',
      left: '0',
      marginTop: '4px'
    }
  }
})

// 监听展开状态，计算位置
watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      // 如果设置了固定位置，使用设置的位置，否则自动计算
      dropdownPosition.value = props.placement === 'auto' ? calculateDropdownPosition() : props.placement
    })
  }
})

// 方法
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    focusedIndex.value = props.options.findIndex(option => option.value === props.modelValue)
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const handleClickOutside = (event: Event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      isOpen.value = false
      break
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, props.options.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (focusedIndex.value >= 0 && focusedIndex.value < props.options.length) {
        const option = props.options[focusedIndex.value]
        if (option) {  // 添加空值检查
          selectOption(option)
        }
      }
      break
  }
}

// 动画钩子
const onDropdownEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  if (dropdownPosition.value === 'top') {
    element.style.transform = 'scaleY(0.8) translateY(8px)'
  } else {
    element.style.transform = 'scaleY(0.8) translateY(-8px)'
  }
}

const onDropdownAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '1'
  element.style.transform = 'scaleY(1) translateY(0)'
}

const onDropdownLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.opacity = '0'
  if (dropdownPosition.value === 'top') {
    element.style.transform = 'scaleY(0.8) translateY(8px)'
  } else {
    element.style.transform = 'scaleY(0.8) translateY(-8px)'
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.pro-select-trigger {
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.pro-select-placeholder {
  color: #a0aec0;
}

.dark .pro-select-placeholder {
  color: #718096;
}

.pro-select-arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: #a0aec0;
}

.dark .pro-select-arrow-icon {
  color: #718096;
}

.pro-select-arrow-open {
  transform: rotate(180deg);
}

.pro-select-dropdown {
  min-width: 120px;
  max-width: 300px; /* 防止过宽 */
  width: auto; /* 改为自动宽度 */
  opacity: 0;
  transform: scaleY(0.8) translateY(-8px);
  transform-origin: top center;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.pro-select-dropdown.top {
  transform-origin: bottom center;
}

.pro-select-dropdown-inner {
  min-width: max-content; /* 让下拉框根据内容自适应宽度 */
  overflow-y: auto;
  padding: 4px 0;
}

.pro-select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px; /* 增加左右内边距 */
  cursor: pointer;
  transition: all 0.2s;
  color: #2d3748;
  white-space: nowrap; /* 防止文字换行 */
}

.dark .pro-select-option {
  color: #e2e8f0;
}

.pro-select-option:hover {
  background-color: #f7fafc;
}

.dark .pro-select-option:hover {
  background-color: #2d3748;
}

.pro-select-option-focused {
  background-color: #edf2f7;
}

.dark .pro-select-option-focused {
  background-color: #4a5568;
}

.pro-select-option-selected {
  color: #3182ce;
  background-color: #ebf8ff;
}

.dark .pro-select-option-selected {
  color: #63b3ed;
  background-color: #2a4365;
}

.pro-select-option-content {
  flex: 1;
  min-width: 0; /* 重要：允许文本截断 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pro-select-option-check {
  width: 14px;
  height: 14px;
  color: #3182ce;
  flex-shrink: 0; /* 防止图标被压缩 */
  margin-left: 8px; /* 与文字保持间距 */
}

.dark .pro-select-option-check {
  color: #63b3ed;
}

/* 暗色主题修正 */
:deep(.dark) .pro-select-trigger {
  background-color: #1a202c;
  border-color: #4a5568;
}

:deep(.dark) .pro-select-trigger:hover {
  border-color: #718096;
}

:deep(.dark) .pro-select-trigger.pro-select-open {
  border-color: #63b3ed;
  ring-color: rgba(99, 179, 237, 0.2);
}
</style>