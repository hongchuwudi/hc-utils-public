// stores/downloadStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DownloadedMusicItem } from '../types/electron'

export const useDownloadStore = defineStore('download', () => {
    // 状态
    const downloadedSongs = ref<DownloadedMusicItem[]>([])
    const refreshing = ref(false)

    // 计算属性
    const songCount = computed(() => downloadedSongs.value.length)
    const totalFileSize = computed(() => downloadedSongs.value.reduce((total, song) => total + (song.fileSize || 0), 0))

    // 格式化文件大小
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '未知'
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`
    }

    // Actions
    const setDownloadedSongs = (songs: DownloadedMusicItem[]) => downloadedSongs.value = songs

    // 设置正在刷新
    const setRefreshing = (value: boolean) => refreshing.value = value

    // 刷新列表
    const refreshList = async (storagePath: string) => {
        if (!storagePath) {
            throw new Error('请先设置下载目录')
        }

        refreshing.value = true
        try {
            if (typeof window !== 'undefined' && window.electronAPI) {
                const songs = await window.electronAPI.getDownloadedMusic(storagePath)
                setDownloadedSongs(songs)
                return songs
            } else {
                throw new Error('下载管理功能仅在 Electron 环境中可用')
            }
        } finally {
            refreshing.value = false
        }
    }

    // 清空所有歌曲
    const clearAll = async (storagePath: string) => {
        try {
            if (typeof window !== 'undefined' && window.electronAPI) {
                // 批量删除所有歌曲
                for (const song of downloadedSongs.value) {
                    await window.electronAPI.deleteDownloadedMusic(storagePath, song.id)
                }
                setDownloadedSongs([])
                return true
            }
        } catch (error) {
            console.error('清空失败:', error)
            throw error
        }
    }

    return {
        // 状态
        downloadedSongs,
        refreshing,

        // 计算属性
        songCount,
        totalFileSize,

        // 方法
        formatFileSize,
        setDownloadedSongs,
        setRefreshing,
        refreshList,
        clearAll
    }
},{
    persist: {
        key: 'download-store',
        paths: ['downloadedSongs']
    }
})