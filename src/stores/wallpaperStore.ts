// stores/wallpaperStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Wallpaper {
    id: string
    name: string
    path: string // 本地文件路径或网络URL
    type: 'image' | 'video'
    createdAt: string
}

export const useWallpaperStore = defineStore('wallpaper', () => {
    // 所有壁纸的链接数组
    const wallpapers = ref<Wallpaper[]>([])
    // 当前使用的壁纸
    const currentWallpaper = ref<Wallpaper | null>(null)
    const videoVolume = ref(0) // 默认静音
    // 添加视频播放进度状态
    const videoProgress = ref(0) // 0-1 之间的进度值

    // 增：添加壁纸链接
    const addWallpaper = (name: string, path: string, type: 'image' | 'video') => {
        const newWallpaper: Wallpaper = {
            id: Date.now().toString(),
            name,
            path,
            type,
            createdAt: new Date().toISOString()
        }
        console.log('addWallpaper', newWallpaper)
        wallpapers.value.push(newWallpaper)
        return newWallpaper
    }

    // 删：删除壁纸链接
    const removeWallpaper = (id: string) => {
        const index = wallpapers.value.findIndex(w => w.id === id)
        if (index !== -1) {
            wallpapers.value.splice(index, 1)
            // 如果删除的是当前壁纸，清空当前壁纸
            if (currentWallpaper.value?.id === id) {
                currentWallpaper.value = null
            }
        }
    }

    // 改：设置当前壁纸
    const setCurrentWallpaper = (wallpaper: Wallpaper | null) => {
        currentWallpaper.value = wallpaper
        // 切换壁纸时重置进度
        videoProgress.value = 0
    }

    // 查：获取所有壁纸
    const getWallpapers = () => {
        return wallpapers.value
    }

    // 设置视频音量
    const setVideoVolume = (volume: number) => {
        videoVolume.value = Math.max(0, Math.min(1, volume)) // 限制在 0-1 范围内
    }

    // 切换静音
    const toggleMute = () => {
        videoVolume.value = videoVolume.value > 0 ? 0 : 0.5 // 静音时恢复为 0.5
    }

    // 设置视频播放进度
    const setVideoProgress = (progress: number) => {
        // 确保进度在 0-1 范围内
        videoProgress.value = Math.max(0, Math.min(1, progress))
        console.log('设置视频进度', videoProgress.value)
    }

    // 重置视频进度（可选）
    const resetVideoProgress = () => {
        videoProgress.value = 0
    }

    return {
        wallpapers,
        currentWallpaper,
        videoVolume,
        videoProgress, // 导出进度状态
        addWallpaper,
        removeWallpaper,
        setCurrentWallpaper,
        getWallpapers,
        setVideoVolume,
        toggleMute,
        setVideoProgress,
        resetVideoProgress // 导出重置函数
    }
}, {
    persist: true
})