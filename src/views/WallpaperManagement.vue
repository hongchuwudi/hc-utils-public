<!-- views/WallpaperManagement.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useWallpaperStore } from '../stores/wallpaperStore'
import ProButton from '@/components/common/proButton.vue'
import { Plus, Trash2, Check, Image,Volume2 , VolumeX} from 'lucide-vue-next'
import { message } from 'ant-design-vue'

const wallpaperStore = useWallpaperStore()

const wallpapers = computed(() => wallpaperStore.wallpapers)
const currentWallpaper = computed(() => wallpaperStore.currentWallpaper)
const videoVolume = computed(() => wallpaperStore.videoVolume)

// 根据文件扩展名获取文件类型
const getFileType = (fileName: string): 'image' | 'video' => {
  const extension = fileName.toLowerCase().split('.').pop()

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv']

  if (imageExtensions.includes(extension || '')) {
    return 'image'
  }
  if (videoExtensions.includes(extension || '')) {
    return 'video'
  }

  return 'image'
}

// 选择壁纸文件
const selectWallpaperFile = async () => {
  if (!window.electronAPI) {
    // 浏览器环境，使用传统的文件输入
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*'
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        const fileUrl = URL.createObjectURL(file)
        const fileType = getFileType(file.name)

        const newWallpaper = wallpaperStore.addWallpaper(file.name, fileUrl, fileType)
        wallpaperStore.setCurrentWallpaper(newWallpaper)
        message.success('壁纸添加成功！')
      }
    }
    input.click()
    return
  }

  // Electron 环境
  try {
    const result = await window.electronAPI.selectWallpaperFile()

    if (result.success && result.filePath && result.fileName) {
      const fileType = getFileType(result.fileName)

      const newWallpaper = wallpaperStore.addWallpaper(
          result.fileName,
          result.filePath,
          fileType
      )

      wallpaperStore.setCurrentWallpaper(newWallpaper)
      message.success('壁纸添加成功！')
    } else if (result.error && result.error !== '用户取消选择') {
      message.error(`选择文件失败: ${result.error}`)
    }
  } catch (error) {
    console.error('选择壁纸文件失败:', error)
    message.error('选择文件失败')
  }
}

const setCurrentWallpaper = (wallpaper: any) => {
  wallpaperStore.setCurrentWallpaper(wallpaper)
  message.success('已设置为当前壁纸')
}

const removeWallpaper = (id: string) => {
  wallpaperStore.removeWallpaper(id)
  message.success('壁纸删除成功')
}

const clearCurrentWallpaper = () => {
  wallpaperStore.setCurrentWallpaper(null)
  message.success('已清除当前壁纸')
}
// 音量控制方法
const setVideoVolume = (volume: number) => {
  wallpaperStore.setVideoVolume(volume)
}

const toggleMute = () => {
  wallpaperStore.toggleMute()
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">壁纸管理</h1>

    <!-- 当前壁纸 -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">当前壁纸</h2>
      <div class="flex items-center space-x-4">
        <div class="w-32 h-20 border-2 border-blue-500 rounded overflow-hidden">
          <img
              v-if="currentWallpaper?.type === 'image'"
              :src="currentWallpaper.path"
              class="w-full h-full object-cover"
          />
          <video
              v-else-if="currentWallpaper?.type === 'video'"
              :src="currentWallpaper.path"
              class="w-full h-full object-cover"
              muted
          />
          <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs"
          >
            无壁纸
          </div>
        </div>
        <div>
          <p class="text-gray-900 dark:text-white">
            {{ currentWallpaper?.name || '默认背景' }}
          </p>
          <ProButton
              type="secondary"
              size="sm"
              :icon="Trash2"
              @click="clearCurrentWallpaper"
              :disabled="!currentWallpaper"
              class="mt-2"
          >
            清除壁纸
          </ProButton>
        </div>
      </div>

      <!-- 视频音量控制 -->
      <div v-if="currentWallpaper?.type === 'video'" class="mt-4">
        <h3 class="text-sm font-medium mb-2 text-gray-900 dark:text-white">视频音量</h3>
        <div class="flex items-center space-x-3">
          <ProButton
              type="ghost"
              size="sm"
              :icon="videoVolume > 0 ? Volume2 : VolumeX"
              @click="toggleMute"
              circle
          />
          <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="videoVolume"
              @input="setVideoVolume(parseFloat(($event.target as HTMLInputElement).value))"
              class="w-32 accent-blue-500"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400 w-8">
                {{ Math.round(videoVolume * 100) }}%
            </span>
        </div>
      </div>
    </div>

    <!-- 添加壁纸 -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">添加壁纸</h2>
      <div class="flex items-center space-x-4">
        <ProButton
            type="primary"
            size="sm"
            :icon="Plus"
            @click="selectWallpaperFile"
        >
          选择壁纸文件
        </ProButton>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          支持图片和视频文件
        </span>
      </div>
    </div>

    <!-- 壁纸列表 -->
    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        壁纸库 ({{ wallpapers.length }})
      </h2>

      <!-- 空状态 -->
      <div
          v-if="wallpapers.length === 0"
          class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <Image class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>还没有添加任何壁纸</p>
      </div>

      <!-- 壁纸网格 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
            v-for="wallpaper in wallpapers"
            :key="wallpaper.id"
            class="bg-white dark:bg-gray-700 rounded-lg border-2 transition-all duration-200"
            :class="currentWallpaper?.id === wallpaper.id
            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
        >
          <!-- 壁纸预览 -->
          <div class="relative h-32 bg-gray-100 dark:bg-gray-600 rounded-t-lg overflow-hidden">
            <img
                v-if="wallpaper.type === 'image'"
                :src="wallpaper.path"
                class="w-full h-full object-cover"
            />
            <video
                v-else
                :src="wallpaper.path"
                class="w-full h-full object-cover"
                muted
            />

            <!-- 操作按钮 -->
            <div class="absolute bottom-2 right-2 flex space-x-1">
              <ProButton
                  type="ghost"
                  size="xs"
                  :icon="Check"
                  @click="setCurrentWallpaper(wallpaper)"
                  :tooltip="currentWallpaper?.id === wallpaper.id ? '当前壁纸' : '设为当前壁纸'"
                  tooltip-position="top"
                  :class="currentWallpaper?.id === wallpaper.id ? 'bg-blue-500 text-white' : ''"
                  circle
              />
              <ProButton
                  type="ghost"
                  size="xs"
                  :icon="Trash2"
                  @click="removeWallpaper(wallpaper.id)"
                  tooltip="删除壁纸"
                  tooltip-position="top"
                  class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  circle
              />
            </div>
          </div>

          <!-- 壁纸信息 -->
          <div class="p-3">
            <h3 class="font-medium text-gray-900 dark:text-white text-sm truncate mb-1">
              {{ wallpaper.name }}
            </h3>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(wallpaper.createdAt) }}
              </span>
              <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="wallpaper.type === 'image'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'"
              >
                {{ wallpaper.type === 'image' ? '图片' : '视频' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>