<template>
  <div>
    <header
        class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300 fixed top-0 left-0 right-0 draggable-header z-[100]"
        :class="{ 'transform translate-y-0': !isCollapsed, 'transform -translate-y-full': isCollapsed }"
    >
      <div class=" mx-auto px-4 sm:px-6 lg:px-8 h-14 transition-opacity duration-300"
           :class="{ 'opacity-100': !isCollapsed, 'opacity-0': isCollapsed }">
        <div class="flex items-center justify-between h-full draggable-content">
          <!-- 左侧：Logo 和导航 -->
          <div class="flex items-center space-x-6" @click="toggleCollapse">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2">
              <img
                  src="../assets/headimg_dl.png"
                  alt="Logo"
                  class="w-7 h-7 object-contain"
              >
              <span class="text-lg font-bold text-gray-900 dark:text-white">HC Utils</span>
            </router-link>

            <!-- 导航菜单 -->
            <nav class="hidden md:flex items-center space-x-1">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Music"
                  @click="handleNavigation('/music')"
                  tooltip="音乐"
                  tooltip-position="bottom"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/music' }"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Video"
                  @click="handleNavigation('/video')"
                  tooltip="视频"
                  tooltip-position="bottom"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/video' }"
              >
                影视
              </ProButton>
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Gamepad"
                  @click="handleNavigation('/game')"
                  tooltip="游戏"
                  tooltip-position="bottom"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/game' }"
              >
                游戏
              </ProButton>
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Wrench"
                  @click="handleNavigation('/watermark')"
                  tooltip="工具"
                  tooltip-position="bottom"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/tools' }"
              >
                工具
              </ProButton>
            </nav>
          </div>
          <!-- 右侧：搜索栏和功能区域 -->
          <div class="flex items-center space-x-4 ml-auto">
            <!-- 搜索栏 -->
            <div v-if="isSearchVisible" class="max-w-xs transition-all duration-300">
              <div class="relative w-full">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="按下回车搜索工具、音乐、影视..."
                    class="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    @keyup.enter="handleSearch"
                />
              </div>
            </div>
            <!-- 功能按钮 -->
            <div class="flex items-center space-x-1">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="isSearchVisible ? X : Search"
                  @click="toggleSearch"
                  :tooltip="isSearchVisible ? '收起搜索栏' : '展开搜索栏'"
                  tooltip-position="bottom"
              />
              <!-- 公告按钮 -->
              <ProButton
                  type="secondary"
                  size="sm"
                  :icon="Bell"
                  @click="showNotice = !showNotice"
                  tooltip="系统公告"
                  tooltip-position="bottom"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="isDark ? Moon : Sun"
                  @click="() =>{toggleTheme(); if (!isCollapsed) toggleCollapse()}"
                  :tooltip="isDark ? '切换到浅色模式' : '切换到深色模式'"
                  tooltip-position="bottom"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="User"
                  @click="handleNavigation('/user')"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/user' }"
                  tooltip="用户选项"
                  tooltip-position="bottom"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="CircleUserRound"
                  @click="handleNavigation('/about')"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/about' }"
                  tooltip="关于作者"
                  tooltip-position="bottom"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Image"
                  @click="handleNavigation('/wallpaper')"
                  tooltip="壁纸管理"
                  tooltip-position="bottom"
                  :class="{ 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400': $route.path === '/wallpaper' }"
              >
                壁纸
              </ProButton>
            </div>
            <!-- 窗口控制按钮 -->
            <div class="flex items-center space-x-1 window-controls" v-if="isElectron">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="Minus"
                  @click="minimizeWindow"
                  tooltip="最小化"
                  tooltip-position="bottom"
                  class="hover:bg-gray-200 dark:hover:bg-gray-700 no-drag"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="isMaximized ? Square : Minimize2"
                  @click="toggleMaximize"
                  :tooltip="isMaximized ? '最大化' : '还原'"
                  tooltip-position="bottom"
                  class="hover:bg-gray-200 dark:hover:bg-gray-700 no-drag"
              />
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="X"
                  @click="closeWindow"
                  tooltip="关闭"
                  tooltip-position="bottom"
                  class="text-red-200 hover:bg-red-100 hover:text-white dark:text-red-300 dark:hover:bg-red-400 no-drag"
              />
            </div>
            <ProButton
                class="bt-0"
                type="ghost"
                size="sm"
                :icon="ChevronUp"
                @click="toggleCollapse"
                tooltip="收起导航栏"
                tooltip-position="bottom"
                :circle="false"
            />
          </div>
        </div>
      </div>
    </header>
    <!-- 展开按钮（只在收起时显示，固定在右上角） -->
    <div
        v-if="isCollapsed"
        class="fixed top-0 right-0 transition-all duration-300 z-[100]"
        style="pointer-events: auto; -webkit-app-region: no-drag;"
    >
      <ProButton
          type="ghost"
          size="sm"
          :icon="ChevronDown"
          @click="toggleCollapse"
          tooltip="展开导航栏"
          tooltip-position="bottom"
          circle
          style="pointer-events: auto; -webkit-app-region: no-drag;"
      />
    </div>
    <!-- 展开触发区域（只在收起时显示，固定在顶部） -->
    <div
        v-if="isCollapsed"
        class="fixed top-0 left-0 right-0 transition-all duration-300 z-[100]"
        style="pointer-events: auto; -webkit-app-region: no-drag;"
    >
      <div
          class="w-full h-3 bg-transparent hover:bg-gray-900/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-center transition-colors duration-200 group relative"
          @click="toggleCollapse"
          @mouseenter="showExpandTooltip = true"
          @mouseleave="showExpandTooltip = false"
      >
        <!-- 悬浮提示 - 显示在细条下方 -->
        <transition name="tooltip-fade">
          <div
              v-if="showExpandTooltip"
              class="absolute z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-xl whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2"
          >
            展开导航栏
            <div class="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 bottom-full left-1/2 -translate-x-1/2 translate-y-1"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <!-- 系统公告 -->
  <NoticeBoard
      v-model:visible="showNotice"
      title="系统公告"
      :content="gloalNotify"
      size="fullscreen"
      icon="bell"
      :show-confirm-button="false"
      @close="showNotice = false"
      content-type="markdown"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import ProButton from '@/components/common/proButton.vue'
import {
  Music,
  Video,
  Gamepad,
  Wrench,
  Search,
  Sun,
  Moon,
  User,
  ChevronUp,
  ChevronDown,
  X,
  CircleUserRound,
  Minus,
  Square,
  Minimize2,
  Bell,
  Image
} from 'lucide-vue-next' //
import { message } from "ant-design-vue";
import NoticeBoard from "@/components/common/NoticeBoard.vue";
import {gloalNotify} from '../text/gloalNotify.ts'
const showExpandTooltip = ref(false) // 展示悬浮提示
const router = useRouter()
const { isDark, toggleTheme } = useTheme()
const searchQuery = ref('')
const isCollapsed = ref(true)
const isSearchVisible = ref(false)
const isElectron = ref(false)
const isMaximized = ref(false)
const showNotice = ref(false)
// 检查是否在 Electron 环境中
onMounted(() => {
  isElectron.value = !!(window as any).electronAPI

  if (isElectron.value) {
    // 监听窗口状态变化
    window.addEventListener('resize', checkWindowState)
    checkWindowState()
  }
})

onUnmounted(() => {
  if (isElectron.value) {
    window.removeEventListener('resize', checkWindowState)
  }
})

const checkWindowState = () => {
  if (isElectron.value) {
    isMaximized.value = window.outerHeight === screen.availHeight
  }
}

// 窗口控制函数
const minimizeWindow = () => {
  if (isElectron.value && (window as any).electronAPI?.minimize) {
    (window as any).electronAPI.minimize()
  }
}

const toggleMaximize = () => {
  if (isElectron.value && (window as any).electronAPI?.toggleMaximize) {
    (window as any).electronAPI.toggleMaximize()
    // 更新最大化状态
    setTimeout(() => {
      isMaximized.value = !isMaximized.value
    }, 100)
  }
}

const closeWindow = () => {
  if (isElectron.value && (window as any).electronAPI?.close) {
    (window as any).electronAPI.close()
  }
}

const toggleSearch = () => isSearchVisible.value = !isSearchVisible.value

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    router.push(`/search?query=${searchQuery.value}`)
    if (!isCollapsed.value) toggleCollapse()
  } else {
    message.error("请输入搜索关键词")
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  emit('toggle-collapse', isCollapsed.value)
}

const handleNavigation = (path: string) => {
  router.push(path)
  // 如果导航栏是展开状态，则收起
  if (!isCollapsed.value) isCollapsed.value = false
  console.log("导航到:", path)
}

const emit = defineEmits(['toggle-collapse'])
</script>

<style scoped>
/* 导航栏展开时：整个header可拖动 */
.draggable-header:not(.transform.-translate-y-full) {
  -webkit-app-region: drag;
}

/* 导航栏收起时：禁用拖动 */
.draggable-header.transform.-translate-y-full {
  -webkit-app-region: no-drag;
}

/* 整个header可拖动 */
.draggable-header {
  -webkit-app-region: drag;
}

/* 窗口控制按钮不可拖动 */
.window-controls {
  -webkit-app-region: no-drag;
}

/* 确保所有按钮、链接和输入框不可拖动 */
button, input, a, router-link, .pro-button {
  -webkit-app-region: no-drag;
}

/* 或者使用更具体的选择器 */
:deep(button) {
  -webkit-app-region: no-drag !important;
}

:deep(input) {
  -webkit-app-region: no-drag !important;
}

:deep(a) {
  -webkit-app-region: no-drag !important;
}

/* 特别针对ProButton组件 */
:deep(.pro-button) {
  -webkit-app-region: no-drag !important;
}

/* 确保收起时完全隐藏 */
.draggable-header.transform.-translate-y-full {
  transform: translateY(-100%) !important;
}

/* 展开时正常显示 */
.draggable-header.transform.translate-y-0 {
  transform: translateY(0) !important;
}
</style>