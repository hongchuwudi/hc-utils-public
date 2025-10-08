// api/downloadedMusic.ts
import type { UnifiedMusicItem } from './music'

export interface DownloadedMusicItem extends UnifiedMusicItem {
    filePath: string
    downloadTime: string
    fileSize?: number
    localCover?: string | null  // 允许 null
}

// 浏览器环境下的模拟实现
export class DownloadedMusicManager {
    // 扫描下载目录 - 只在 Electron 环境中有效
    static async scanDownloadedMusic(savePath: string): Promise<DownloadedMusicItem[]> {
        // 检查是否在 Electron 环境中
        if (typeof window !== 'undefined' && window.electronAPI) {
            try {
                const result = await window.electronAPI!.getDownloadedMusic(savePath)
                // 使用类型断言
                return result as unknown as DownloadedMusicItem[]
            } catch (error) {
                console.error('扫描下载歌曲失败:', error)
                return []
            }
        } else {
            // 浏览器环境返回空数组或模拟数据
            console.warn('下载管理功能仅在 Electron 环境中可用')
            return []
        }
    }

    // 删除下载的歌曲
    static async deleteDownloadedMusic(savePath: string, songId: string): Promise<boolean> {
        if (typeof window !== 'undefined' && window.electronAPI) {
            try {
                return await window.electronAPI.deleteDownloadedMusic(savePath, songId)
            } catch (error) {
                console.error('删除下载歌曲失败:', error)
                return false
            }
        } else {
            console.warn('下载管理功能仅在 Electron 环境中可用')
            return false
        }
    }
}