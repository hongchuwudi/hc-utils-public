// src/types/electron.d.ts

// 下载歌曲项
export interface DownloadedMusicItem {
    id: string
    title: string
    singer: string
    source: string
    quality: string
    n: number
    cover?: string
    link?: string
    lyric?: string
    music_http_url?: string
    music_url?: string
    filePath: string
    downloadTime: string
    fileSize?: number
    localCover?: string
}

// 弹窗结果
interface DialogResult {
    canceled: boolean
    filePaths: string[]
}

// 下载歌曲参数
interface DownloadMusicOptions {
    musicUrl: string
    musicInfo: {
        title: string
        singer: string
        source: string
        quality: string
        cover?: string
        link?: string
        lyric?: string
    }
    savePath: string
}

// 打开外部链接的返回结果
interface OpenExternalResult {
    success: boolean
    error?: string
}

// Electron API 暴露给渲染进程的接口
interface ElectronAPI {
    platform: string
    versions: {
        node: string
        chrome: string
        electron: string
    }
    showOpenDialog: (options: any) => Promise<DialogResult>
    downloadMusic: (options: DownloadMusicOptions) => Promise<boolean>
    minimize: () => void
    toggleMaximize: () => void
    close: () => void
    onWindowStateChanged: (callback: (isMaximized: boolean) => void) => void
    getDownloadedMusic: (savePath: string) => Promise<DownloadedMusicItem[]>
    deleteDownloadedMusic: (savePath: string, songId: string) => Promise<boolean>
    openExternal: (url: string) => Promise<OpenExternalResult>

    // 壁纸相关 API
    selectWallpaperFile: () => Promise<{
        success: boolean;
        filePath?: string;
        fileName?: string;
        error?: string
    }>
}

// 将 ElectronAPI 接口合并到全局的 Window 接口中
declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}

// 使此文件成为一个模块，防止全局作用域污染
export {}