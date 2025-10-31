import { ipcMain, dialog,net,session } from 'electron'
import { DownloadManager } from '../managers/downloadManager'
import { WindowManager } from './WindowManager'

export class IpcHandler {
    static initialize() {
        this.setupWindowControls()  // 窗口控制
        this.setupDialogHandlers()  // 对话框
        this.setupDownloadHandlers() // 下载
        this.setupWallpaperHandlers() // 壁纸
        this.setupWindowStateListeners() // 窗口状态
        this.setupVideoProxyHandlers() // 视频代理
    }
    // 窗口控制
    static setupWindowControls() {
        ipcMain.on('window-minimize', () => WindowManager.getMainWindow()?.minimize())
        ipcMain.on('window-toggle-maximize', () => {
            const mainWindow = WindowManager.getMainWindow()
            if (mainWindow) {
                if (mainWindow.isMaximized()) mainWindow.unmaximize()
                else mainWindow.maximize()
                mainWindow.webContents.send('window-state-changed', mainWindow.isMaximized())
            }
        })
        ipcMain.on('window-close', () => WindowManager.getMainWindow()?.hide())
    }
    // 对话框
    static setupDialogHandlers() {
        ipcMain.handle('open-external', async (event, url: string) => {
            try {
                if (!url || typeof url !== 'string' || !url.startsWith('http')) {
                    throw new Error('无效的 URL')
                }
                const { shell } = require('electron')
                await shell.openExternal(url)
                return { success: true }
            } catch (error) {
                console.error('打开外部链接失败:', error)
                return { success: false, error: error }
            }
        })
        ipcMain.handle('dialog:openDirectory', async () => {
            const mainWindow = WindowManager.getMainWindow()
            if (!mainWindow) return { canceled: true, filePaths: [] }
            return await dialog.showOpenDialog(mainWindow, {
                properties: ['openDirectory'],
                title: '选择音乐下载目录'
            })
        })
    }
    // 下载
    static setupDownloadHandlers() {
        ipcMain.handle('download:music', async (event, options) => DownloadManager.downloadMusic(options))
        ipcMain.handle('download:get-downloaded', async (event, savePath: string) => {
            console.log('接收到获取下载歌曲请求:', savePath)
            return DownloadManager.scanDownloadedMusic(savePath)
        })
        ipcMain.handle('download:delete', async (event, { savePath, songId }) => {
            console.log('接收到删除歌曲请求:', { savePath, songId })
            return DownloadManager.deleteDownloadedMusic(savePath, songId)
        })
    }
    // 壁纸
    static setupWallpaperHandlers() {
        ipcMain.handle('wallpaper:select-file', async () => {
            const mainWindow = WindowManager.getMainWindow()
            if (!mainWindow) return { success: false, error: '窗口未初始化' }

            try {
                const result = await dialog.showOpenDialog(mainWindow, {
                    title: '选择壁纸文件',
                    filters: [
                        { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
                        { name: '视频文件', extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'] }
                    ],
                    properties: ['openFile']
                })

                if (result.canceled || result.filePaths.length === 0) {
                    return { success: false, error: '用户取消选择' }
                }

                const filePath = result.filePaths[0]
                const fileName = require('path').basename(filePath)
                const correctedPath = 'file:///' + filePath.replace(/\\/g, '/')

                return {
                    success: true,
                    filePath: correctedPath,
                    fileName
                }
            } catch (error) {
                console.error('选择壁纸文件失败:', error)
                return { success: false, error: error }
            }
        })
    }
    // 窗口状态
    static setupWindowStateListeners() {
        const mainWindow = WindowManager.getMainWindow()
        if (mainWindow) {
            mainWindow.on('maximize', () => mainWindow.webContents.send('window-state-changed', true))
            mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-state-changed', false))
        }
    }

    // 视频代理
    static setupVideoProxyHandlers() {
        // 直接设置，因为此时应用已经ready了
        session.defaultSession.webRequest.onBeforeSendHeaders(
            { urls: ['*://*.bilivideo.com/*'] },
            (details, callback) => {
                details.requestHeaders['Referer'] = 'https://www.bilibili.com'
                callback({ requestHeaders: details.requestHeaders })
            }
        )
    }
}