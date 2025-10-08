<template>
  <Teleport to="body">
    <!-- 模态框 -->
    <div v-if="visible" class="notice-board-component fixed inset-0 z-[100] flex items-start justify-center py-8 bg-black bg-opacity-50" @click="handleBackdropClick">
      <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col"
          :class="sizeClasses"
          @click.stop
      >
        <!-- 标题栏 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <component :is="titleIcon" v-if="titleIcon" class="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <!-- 复制按钮 -->
            <ProButton
                v-if="showCopyButton"
                @click="copyContent"
                type="ghost"
                size="sm"
                :icon="Copy"
                :tooltip="copyButtonText"
                tooltip-position="bottom"
            />
            <!-- 关闭按钮 -->
            <ProButton
                type="ghost"
                size="sm"
                :icon="X"
                @click="closeModal"
                tooltip="关闭"
                tooltip-position="bottom"
            />
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <!-- 公告内容 -->
          <div class="notice-content" v-html="renderedContent"></div>

          <!-- 更新时间 -->
          <div v-if="showUpdateTime && updateTime" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock class="w-3 h-3" />
              <span>最后更新: {{ formatUpdateTime(updateTime) }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div v-if="showActions" class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
              v-if="showCancelButton"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            {{ cancelButtonText }}
          </button>
          <button
              v-if="showConfirmButton"
              @click="handleConfirm"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { X, Copy, Clock, Bell, AlertTriangle, Info } from 'lucide-vue-next'
import { message } from 'ant-design-vue'
import MarkdownIt from 'markdown-it'
import ProButton from "@/components/common/proButton.vue";

// 定义组件属性
interface Props {
  // 基础属性
  title?: string
  content: string
  visible?: boolean
  // 尺寸选项
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  // 图标选项
  icon?: 'bell' | 'alert' | 'info' | 'none'
  // 功能选项
  showCopyButton?: boolean
  showUpdateTime?: boolean
  updateTime?: string | Date
  showActions?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelButtonText?: string
  confirmButtonText?: string
  // 内容格式
  contentType?: 'html' | 'markdown'
  // 自动关闭
  autoClose?: boolean
  autoCloseDelay?: number
}

// 默认属性值
const props = withDefaults(defineProps<Props>(), {
  title: '公告',
  visible: false,
  size: 'medium',
  icon: 'bell',
  showCopyButton: true,
  showUpdateTime: true,
  showActions: true,
  showCancelButton: true,
  showConfirmButton: false,
  cancelButtonText: '关闭',
  confirmButtonText: '确认',
  contentType: 'html',
  autoClose: false,
  autoCloseDelay: 5000
})

// 定义事件
interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  quotes: '“”‘’',
  xhtmlOut: true
})

const copyButtonText = ref('复制内容')

// 计算属性
const sizeClasses = computed(() => {
  const classes = {
    small: 'w-full max-w-md mx-auto max-h-[60vh]',
    medium: 'w-full max-w-2xl mx-auto max-h-[70vh]',
    large: 'w-full max-w-4xl mx-auto max-h-[80vh]',
    fullscreen: 'w-[95vw] h-[95vh] mx-auto'
  }
  return classes[props.size]
})

const titleIcon = computed(() => {
  const icons = {
    bell: Bell,
    alert: AlertTriangle,
    info: Info,
    none: null
  }
  return icons[props.icon]
})

const renderedContent = computed(() => {
  if (props.contentType === 'markdown') {
    try {
      return md.render(props.content)
    } catch (error) {
      console.error('Markdown 解析错误:', error)
      return `<div class="text-red-500 dark:text-red-400">Markdown 内容解析错误: ${error}</div>`
    }
  }
  return props.content
})

// 方法
const closeModal = () => {
  emit('update:visible', false)
  emit('close')
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
  closeModal()
}

const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('bg-opacity-50')) {
    closeModal()
  }
}

const copyContent = async () => {
  try {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = renderedContent.value
    const textContent = tempDiv.textContent || tempDiv.innerText || ''

    await navigator.clipboard.writeText(textContent)
    copyButtonText.value = '已复制!'
    message.success('内容已复制到剪贴板')

    setTimeout(() => {
      copyButtonText.value = '复制内容'
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    message.error('复制失败，请手动复制内容')
  }
}

const formatUpdateTime = (time: string | Date) => {
  try {
    const date = typeof time === 'string' ? new Date(time) : time
    if (isNaN(date.getTime())) {
      return '无效时间'
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('时间格式化错误:', error)
    return '时间格式错误'
  }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible) {
    closeModal()
  }
}

// 自动关闭逻辑
let autoCloseTimer: number | null = null

const setupAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }

  if (props.visible && props.autoClose) {
    autoCloseTimer = setTimeout(() => {
      closeModal()
    }, props.autoCloseDelay) as unknown as number
  }
}

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
    setupAutoClose()
  } else {
    document.removeEventListener('keydown', handleKeydown)
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})

// 监听 autoClose 相关属性变化
watch(() => [props.autoClose, props.autoCloseDelay], () => {
  setupAutoClose()
})

onMounted(() => {
  if (props.visible) {
    document.addEventListener('keydown', handleKeydown)
    setupAutoClose()
  }
})

// 组件卸载时清理
import { onUnmounted } from 'vue'

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
})

// 暴露方法给父组件
defineExpose({
  closeModal,
  copyContent
})
</script>

<style scoped>
.notice-board-component {
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

/* 内容区域样式 */
.notice-content {
  line-height: 1.6;
  color: #374151; /* gray-700 */
}

.dark .notice-content {
  color: #d1d5db; /* gray-300 */
}

.notice-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827; /* gray-900 */
  border-bottom: 1px solid #e5e7eb; /* gray-200 */
  padding-bottom: 0.5rem;
}

.dark .notice-content :deep(h1) {
  color: #f9fafb; /* gray-50 */
  border-bottom-color: #374151; /* gray-700 */
}

.notice-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1f2937; /* gray-800 */
}

.dark .notice-content :deep(h2) {
  color: #f3f4f6; /* gray-100 */
}

.notice-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1f2937; /* gray-800 */
}

.dark .notice-content :deep(h3) {
  color: #f3f4f6; /* gray-100 */
}

.notice-content :deep(p) {
  margin-bottom: 1rem;
}

.notice-content :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.notice-content :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.notice-content :deep(li) {
  margin-bottom: 0.25rem;
}

.notice-content :deep(blockquote) {
  border-left: 4px solid #3b82f6; /* blue-500 */
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  background-color: #eff6ff; /* blue-50 */
  padding: 1rem;
  border-radius: 0 0.375rem 0.375rem 0;
}

.dark .notice-content :deep(blockquote) {
  background-color: #1e3a8a; /* blue-900 */
  border-left-color: #60a5fa; /* blue-400 */
  color: #dbeafe; /* blue-100 */
}

.notice-content :deep(code) {
  background-color: #f3f4f6; /* gray-100 */
  color: #1f2937; /* gray-800 */
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

.dark .notice-content :deep(code) {
  background-color: #374151; /* gray-700 */
  color: #f9fafb; /* gray-50 */
}

.notice-content :deep(pre) {
  background-color: #f8fafc; /* gray-50 */
  color: #1e293b; /* slate-800 */
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0; /* gray-200 */
}

.dark .notice-content :deep(pre) {
  background-color: #1e293b; /* slate-800 */
  color: #f1f5f9; /* slate-100 */
  border-color: #334155; /* slate-700 */
}

.notice-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.notice-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.notice-content :deep(th) {
  background-color: #f9fafb; /* gray-50 */
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e5e7eb; /* gray-200 */
  color: #374151; /* gray-700 */
}

.dark .notice-content :deep(th) {
  background-color: #374151; /* gray-700 */
  border-color: #4b5563; /* gray-600 */
  color: #f9fafb; /* gray-50 */
}

.notice-content :deep(td) {
  padding: 0.75rem;
  border: 1px solid #e5e7eb; /* gray-200 */
  color: #6b7280; /* gray-500 */
}

.dark .notice-content :deep(td) {
  border-color: #4b5563; /* gray-600 */
  color: #d1d5db; /* gray-300 */
}

.notice-content :deep(a) {
  color: #3b82f6; /* blue-500 */
  text-decoration: underline;
  transition: color 0.2s ease;
}

.notice-content :deep(a:hover) {
  color: #2563eb; /* blue-600 */
}

.dark .notice-content :deep(a) {
  color: #60a5fa; /* blue-400 */
}

.dark .notice-content :deep(a:hover) {
  color: #93c5fd; /* blue-300 */
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f5f9;
}

.dark .custom-scrollbar {
  scrollbar-color: #6366f1 #374151;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* slate-100 */
  border-radius: 4px;
  margin: 4px 0;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: #374151; /* gray-700 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.3s ease;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #818cf8, #a78bfa);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  transform: scale(1.1);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

/* 确认按钮暗色主题适配 */
.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-blue-500:hover {
  background-color: #2563eb;
}

.dark .bg-blue-600 {
  background-color: #2563eb;
}

.dark .bg-blue-600:hover {
  background-color: #1d4ed8;
}
</style>