import { WindowManager } from './WindowManager'
import { TrayManager } from './TrayManager'
import { IpcHandler } from './IpcHandler'
import { IconManager } from '../managers/iconManager'
import path from 'path'

export class AppManager {
    public static isQuitting = false
    private static isDev: boolean = false      // 是否为开发环境(默认生产环境)

    // 初始化应用
    static initialize(isDev: boolean) {
        this.isDev = isDev
        this.initializeIconManager()            // 初始化图标管理器
        WindowManager.initialize(this.isDev)    // 初始化窗口
        TrayManager.initialize()                // 初始化托盘
        IpcHandler.initialize()                 // 初始化IPC处理器
    }

    // 初始化图标管理器
    private static initializeIconManager() {
        const iconBasePath = this.isDev
            ? path.join(__dirname, '../../public/icos') //  开发环境
            : path.join(__dirname, '../../public/icos') //  生产环境
        IconManager.initialize(iconBasePath)
        IconManager.checkAvailableIcons()
    }

}