<!-- components/common/ConfirmModal.vue -->
<template>
  <div class="confirm-modal z-[100]">
    <!-- 模态框 -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" @click="handleBackdropClick">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4" @click.stop>
        <!-- 标题栏 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <component
                :is="headerIcon"
                class="w-5 h-5"
                :class="iconColorClass"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
          </div>
          <button
              v-if="showCloseButton"
              @click="closeModal"
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 自定义内容插槽 -->
          <div class="mb-4">
            <slot name="content">
              <!-- 默认内容 -->
              <div class="text-gray-700 dark:text-gray-300">
                {{ content }}
              </div>
            </slot>
          </div>

          <!-- 警告/提示信息 -->
          <div
              v-if="warningText"
              class="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
          >
            <div class="flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span class="text-sm text-yellow-700 dark:text-yellow-300">
                {{ warningText }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
              v-if="showCancelButton"
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
              @click="handleConfirm"
              :disabled="confirmDisabled"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm"
              :class="confirmButtonClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, AlertTriangle, AlertCircle, Info, Trash2 } from 'lucide-vue-next'

interface Props {
  // 基础配置
  title?: string
  content?: string
  warningText?: string

  // 按钮文本
  confirmText?: string
  cancelText?: string

  // 显示控制
  showCloseButton?: boolean
  showCancelButton?: boolean
  confirmDisabled?: boolean

  // 图标和样式
  type?: 'warning' | 'danger' | 'info' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  content: '',
  confirmText: '确认',
  cancelText: '取消',
  showCloseButton: true,
  showCancelButton: true,
  confirmDisabled: false,
  type: 'warning'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const showModal = ref(false)

// 根据类型确定图标和颜色
const headerIcon = computed(() => {
  switch (props.type) {
    case 'danger':
      return Trash2
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return AlertCircle
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-gray-600 dark:text-gray-300'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
    case 'info':
      return 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
    default:
      return 'bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
  }
})

// 打开模态框
const openModal = () => {
  showModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  emit('close')
}

// 确认操作
const handleConfirm = () => {
  emit('confirm')
  closeModal()
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
  closeModal()
}

// 点击模态框外部关闭
const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('bg-opacity-50')) {
    closeModal()
  }
}

// 暴露方法给父组件
defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped>
.confirm-modal {
  display: inline-block;
}

/* 模态框动画 */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-opacity-50 {
  backdrop-filter: blur(4px);
}
</style>