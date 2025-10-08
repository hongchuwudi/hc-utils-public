// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

interface MusicInfo {
    title: string
    singer: string
    source: string
    quality: string
    downloadTime: string
    cover?: string
    link?: string
    lyric?: string
}
interface DownloadMusicOptions {
    musicUrl: string
    musicInfo: MusicInfo
    savePath: string
}
export interface DownloadedMusicItem {
    id: string
    title: string
    singer: string
    source: string
    quality: string
    n: number
    cover?: string | null  // 允许 null
    link?: string | null   // 允许 null
    lyric?: string | null  // 允许 null
    music_url?: string
    filePath: string
    downloadTime: string
    fileSize?: number
    localCover?: string | null  // 改为可选并允许 null
}

// 定义 electronAPI 的类型
interface ElectronAPI {
    platform: string
    versions: {
        node: string
        chrome: string
        electron: string
    }
    showOpenDialog: (options: any) => Promise<any>
    downloadMusic: (options: DownloadMusicOptions) => Promise<boolean>
    minimize: () => void
    toggleMaximize: () => void
    close: () => void
    onWindowStateChanged: (callback: (isMaximized: boolean) => void) => void
    getDownloadedMusic: (savePath: string) => Promise<DownloadedMusicItem[]>
    deleteDownloadedMusic: (savePath: string, songId: string) => Promise<boolean>
    openExternal: (url: string) => Promise<{ success: boolean; error?: string }>

    // 壁纸相关 API
    selectWallpaperFile: () => Promise<{
        success: boolean;
        filePath?: string;
        fileName?: string;
        error?: string
    }>
}

// 扩展 preload 内容
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:openDirectory', options),
    downloadMusic: (options: DownloadMusicOptions) => ipcRenderer.invoke('download:music', options),
    minimize: () => ipcRenderer.send('window-minimize'),
    toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
    close: () => ipcRenderer.send('window-close'),
    onWindowStateChanged: (callback: (isMaximized: boolean) => void) => ipcRenderer.on('window-state-changed', (_, isMaximized: boolean) => callback(isMaximized)),
    getDownloadedMusic: (savePath: string) => ipcRenderer.invoke('download:get-downloaded', savePath),
    deleteDownloadedMusic: (savePath: string, songId: string) => ipcRenderer.invoke('download:delete', { savePath, songId }),
    openExternal: (url: string) => ipcRenderer.invoke('open-external', url),

    // 壁纸相关 API
    selectWallpaperFile: () => ipcRenderer.invoke('wallpaper:select-file')
} as ElectronAPI)