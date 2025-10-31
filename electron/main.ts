import { app } from 'electron'
import { AppManager } from './app/AppManager'

const isDev = process.env.NODE_ENV === 'development'

// 初始化应用
app.whenReady().then(() => {
    console.log('[app] ready就绪....')
    AppManager.initialize(isDev)
})

// 应用事件处理
app.on('window-all-closed', () => {
    console.log('[app] window-all-closed fired，阻止退出，保持后台运行')
    if (process.platform !== 'darwin') console.log('[app] 保持应用后台运行')
})

app.on('before-quit', (event) => {
    console.log('[app] before-quit, isQuitting =', AppManager.isQuitting)
})

app.on('will-quit', (event) => {
    console.log('[app] will-quit, isQuitting =', AppManager.isQuitting)
})

// 处理未捕获的异常
process.on('uncaughtException', (err) => console.error('[process] uncaughtException', err))