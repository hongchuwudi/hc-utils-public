"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcHandler = void 0;
const electron_1 = require("electron");
const downloadManager_1 = require("../managers/downloadManager");
const WindowManager_1 = require("./WindowManager");
class IpcHandler {
    static initialize() {
        this.setupWindowControls(); // 窗口控制
        this.setupDialogHandlers(); // 对话框
        this.setupDownloadHandlers(); // 下载
        this.setupWallpaperHandlers(); // 壁纸
        this.setupWindowStateListeners(); // 窗口状态
        this.setupVideoProxyHandlers(); // 视频代理
    }
    // 窗口控制
    static setupWindowControls() {
        electron_1.ipcMain.on('window-minimize', () => WindowManager_1.WindowManager.getMainWindow()?.minimize());
        electron_1.ipcMain.on('window-toggle-maximize', () => {
            const mainWindow = WindowManager_1.WindowManager.getMainWindow();
            if (mainWindow) {
                if (mainWindow.isMaximized())
                    mainWindow.unmaximize();
                else
                    mainWindow.maximize();
                mainWindow.webContents.send('window-state-changed', mainWindow.isMaximized());
            }
        });
        electron_1.ipcMain.on('window-close', () => WindowManager_1.WindowManager.getMainWindow()?.hide());
    }
    // 对话框
    static setupDialogHandlers() {
        electron_1.ipcMain.handle('open-external', async (event, url) => {
            try {
                if (!url || typeof url !== 'string' || !url.startsWith('http')) {
                    throw new Error('无效的 URL');
                }
                const { shell } = require('electron');
                await shell.openExternal(url);
                return { success: true };
            }
            catch (error) {
                console.error('打开外部链接失败:', error);
                return { success: false, error: error };
            }
        });
        electron_1.ipcMain.handle('dialog:openDirectory', async () => {
            const mainWindow = WindowManager_1.WindowManager.getMainWindow();
            if (!mainWindow)
                return { canceled: true, filePaths: [] };
            return await electron_1.dialog.showOpenDialog(mainWindow, {
                properties: ['openDirectory'],
                title: '选择音乐下载目录'
            });
        });
    }
    // 下载
    static setupDownloadHandlers() {
        electron_1.ipcMain.handle('download:music', async (event, options) => downloadManager_1.DownloadManager.downloadMusic(options));
        electron_1.ipcMain.handle('download:get-downloaded', async (event, savePath) => {
            console.log('接收到获取下载歌曲请求:', savePath);
            return downloadManager_1.DownloadManager.scanDownloadedMusic(savePath);
        });
        electron_1.ipcMain.handle('download:delete', async (event, { savePath, songId }) => {
            console.log('接收到删除歌曲请求:', { savePath, songId });
            return downloadManager_1.DownloadManager.deleteDownloadedMusic(savePath, songId);
        });
    }
    // 壁纸
    static setupWallpaperHandlers() {
        electron_1.ipcMain.handle('wallpaper:select-file', async () => {
            const mainWindow = WindowManager_1.WindowManager.getMainWindow();
            if (!mainWindow)
                return { success: false, error: '窗口未初始化' };
            try {
                const result = await electron_1.dialog.showOpenDialog(mainWindow, {
                    title: '选择壁纸文件',
                    filters: [
                        { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
                        { name: '视频文件', extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'] }
                    ],
                    properties: ['openFile']
                });
                if (result.canceled || result.filePaths.length === 0) {
                    return { success: false, error: '用户取消选择' };
                }
                const filePath = result.filePaths[0];
                const fileName = require('path').basename(filePath);
                const correctedPath = 'file:///' + filePath.replace(/\\/g, '/');
                return {
                    success: true,
                    filePath: correctedPath,
                    fileName
                };
            }
            catch (error) {
                console.error('选择壁纸文件失败:', error);
                return { success: false, error: error };
            }
        });
    }
    // 窗口状态
    static setupWindowStateListeners() {
        const mainWindow = WindowManager_1.WindowManager.getMainWindow();
        if (mainWindow) {
            mainWindow.on('maximize', () => mainWindow.webContents.send('window-state-changed', true));
            mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-state-changed', false));
        }
    }
    // 视频代理
    static setupVideoProxyHandlers() {
        // 直接设置，因为此时应用已经ready了
        electron_1.session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['*://*.bilivideo.com/*'] }, (details, callback) => {
            details.requestHeaders['Referer'] = 'https://www.bilibili.com';
            callback({ requestHeaders: details.requestHeaders });
        });
    }
}
exports.IpcHandler = IpcHandler;
