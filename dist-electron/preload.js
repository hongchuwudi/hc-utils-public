"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electron/preload.ts
const electron_1 = require("electron");
// 扩展 preload 内容
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    },
    showOpenDialog: (options) => electron_1.ipcRenderer.invoke('dialog:openDirectory', options),
    downloadMusic: (options) => electron_1.ipcRenderer.invoke('download:music', options),
    minimize: () => electron_1.ipcRenderer.send('window-minimize'),
    toggleMaximize: () => electron_1.ipcRenderer.send('window-toggle-maximize'),
    close: () => electron_1.ipcRenderer.send('window-close'),
    onWindowStateChanged: (callback) => electron_1.ipcRenderer.on('window-state-changed', (_, isMaximized) => callback(isMaximized)),
    getDownloadedMusic: (savePath) => electron_1.ipcRenderer.invoke('download:get-downloaded', savePath),
    deleteDownloadedMusic: (savePath, songId) => electron_1.ipcRenderer.invoke('download:delete', { savePath, songId }),
    openExternal: (url) => electron_1.ipcRenderer.invoke('open-external', url),
    // 壁纸相关 API
    selectWallpaperFile: () => electron_1.ipcRenderer.invoke('wallpaper:select-file')
});
