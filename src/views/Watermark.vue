<template>
  <!-- 左侧边导航栏容器 -->
  <div
      class="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-90 sidebar-container"
      :class="{ 'w-12': isCollapsed, 'w-32': !isCollapsed }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
  >
    <!-- 导航内容 -->
    <div class="flex flex-col h-full py-4">
      <!-- Logo区域 -->
      <div class="flex items-center justify-center mb-6 px-2">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Video class="w-4 h-4 text-white" />
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="ml-2 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
            视频解析
          </span>
        </transition>
      </div>

      <!-- 导航按钮区域 -->
      <nav class="flex-1 space-y-1 px-2">
        <!-- 哔哩哔哩 -->
        <div class="flex justify-center">
          <ProButton
              type="ghost"
              size="sm"
              :icon="Play"
              :tooltip="isCollapsed ? '哔站' : undefined"
              :tooltip-position="isCollapsed ? 'right' : undefined"
              :show-text="!isCollapsed"
              :circle="isCollapsed"
              @click="handleNavigation('/video/bilibili')"
              class="transition-all duration-200"
              :class="{
              'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path.includes('/bilibili'),
              '!w-full !justify-start !px-2': !isCollapsed
            }"
          >
            哔站
          </ProButton>
        </div>
        <!-- 抖音 -->
        <div class="flex justify-center">
          <ProButton
              type="ghost"
              size="sm"
              :icon="Music2"
              :tooltip="isCollapsed ? '抖音' : undefined"
              :tooltip-position="isCollapsed ? 'right' : undefined"
              :show-text="!isCollapsed"
              :circle="isCollapsed"
              @click="handleNavigation('/video/douyin')"
              class="transition-all duration-200"
              :class="{
              'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path.includes('/douyin'),
              '!w-full !justify-start !px-2': !isCollapsed
            }"
          >
            抖音
          </ProButton>
        </div>
        <!-- 快手 -->
        <div class="flex justify-center">
          <ProButton
              type="ghost"
              size="sm"
              :icon="Zap"
              :tooltip="isCollapsed ? '快手' : undefined"
              :tooltip-position="isCollapsed ? 'right' : undefined"
              :show-text="!isCollapsed"
              :circle="isCollapsed"
              @click="handleNavigation('/video/kuaishou')"
              class="transition-all duration-200"
              :class="{
              'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path.includes('/kuaishou'),
              '!w-full !justify-start !px-2': !isCollapsed
            }"
          >
            快手
          </ProButton>
        </div>
        <!-- 更多视频平台 -->
        <div class="flex justify-center">
          <ProButton
              type="ghost"
              size="sm"
              :icon="Plus"
              :tooltip="isCollapsed ? '更多' : undefined"
              :tooltip-position="isCollapsed ? 'right' : undefined"
              :show-text="!isCollapsed"
              :circle="isCollapsed"
              @click="handleNavigation('/video/more')"
              class="transition-all duration-200"
              :class="{
              '!w-full !justify-start !px-2': !isCollapsed
            }"
          >
            更多
          </ProButton>
        </div>
      </nav>

      <!-- 底部区域 -->
      <div class="px-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-center">
          <ProButton
              type="ghost"
              size="sm"
              :icon="isPinned ? Pin : PinOff"
              :tooltip="isCollapsed ? (isPinned ? '取消固定' : '固定导航栏') : undefined"
              :tooltip-position="isCollapsed ? 'right' : undefined"
              :show-text="!isCollapsed"
              :circle="isCollapsed"
              @click="togglePin"
              class="transition-all duration-200"
              :class="{
              'bg-gray-100 dark:bg-gray-700': isPinned,
              '!w-full !justify-start !px-2': !isCollapsed
            }"
          >
            {{ isPinned ? '已固定' : '固定' }}
          </ProButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ProButton from '@/components/common/proButton.vue'
import { Video, Play, Music2, Zap, Plus, Pin, PinOff } from 'lucide-vue-next'

const router = useRouter()
const isCollapsed = ref(true)
const isPinned = ref(false)

// 处理导航
const handleNavigation = (path: string) => router.push(path)

// 切换固定状态
const togglePin = () => {
  isPinned.value = !isPinned.value
  if (isPinned.value) isCollapsed.value = false
}

// 鼠标事件处理
let leaveTimer: number | null = null
// 鼠标进入
const handleMouseEnter = () => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  // 确保导航栏在收起状态下宽度正确
  if (!isPinned.value) isCollapsed.value = false
}
// 鼠标离开
const handleMouseLeave = () => {
  if (!isPinned.value) {
    leaveTimer = setTimeout(() => {
      isCollapsed.value = true
    }, 300)
  }
}

// 点击外部收起
const handleClickOutside = (event: MouseEvent) => {
  const sidebar = document.querySelector('.sidebar-container')
  if (sidebar && !sidebar.contains(event.target as Node) && !isPinned.value) {
    isCollapsed.value = true
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (leaveTimer) clearTimeout(leaveTimer)
})
</script>

<style scoped>
.z-90 {
  z-index: 90;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 确保导航栏在收起状态下宽度正确 */
.sidebar-container {
  transition: width 0.3s ease;
}

/* 强制水平布局 */
:deep(.pro-button) {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

/* 当有文字时确保水平排列 */
:deep(.pro-button:not(.circle) span) {
  margin-left: 8px !important;
  white-space: nowrap !important;
}
</style>