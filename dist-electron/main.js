"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const AppManager_1 = require("./app/AppManager");
const isDev = process.env.NODE_ENV === 'development';
// 初始化应用
electron_1.app.whenReady().then(() => {
    console.log('[app] ready');
    AppManager_1.AppManager.initialize(isDev);
});
// 应用事件处理
electron_1.app.on('window-all-closed', () => {
    console.log('[app] window-all-closed fired，阻止退出，保持后台运行');
    if (process.platform !== 'darwin')
        console.log('[app] 保持应用后台运行');
});
electron_1.app.on('before-quit', (event) => {
    console.log('[app] before-quit, isQuitting =', AppManager_1.AppManager.isQuitting);
});
electron_1.app.on('will-quit', (event) => {
    console.log('[app] will-quit, isQuitting =', AppManager_1.AppManager.isQuitting);
});
// 处理未捕获的异常
process.on('uncaughtException', (err) => console.error('[process] uncaughtException', err));
