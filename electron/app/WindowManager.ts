import { BrowserWindow } from 'electron'
import path from 'path'
import { IconManager } from '../managers/iconManager'
import { AppManager } from './AppManager'

export class WindowManager {
    public static mainWindow: BrowserWindow | null = null
    private static isDev: boolean = false

    static initialize(isDev: boolean) {
        this.isDev = isDev
        this.createMainWindow()
    }

    static createMainWindow() {
        const windowIcon = IconManager.loadAppIcon(IconManager.getRecommendedWindowIconSize())

        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minHeight: 686,
            minWidth: 350,
            icon: windowIcon,
            frame: false,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, '../preload.js'),
                webSecurity: false,
            },
            show: false
        })

        // 彻底移除菜单
        this.mainWindow.setMenuBarVisibility(false)
        this.mainWindow.removeMenu()

        // 加载页面
        if (this.isDev) {
            this.mainWindow.loadURL('http://localhost:5173')
            this.mainWindow.webContents.openDevTools()
        } else
            this.mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))

        this.setupWindowEvents()
    }

    private static setupWindowEvents() {
        if (!this.mainWindow) return

        this.mainWindow.on('close', (event) => {
            console.log('[main] close event fired, isQuitting =', AppManager.isQuitting)
            if (!AppManager.isQuitting) {
                event.preventDefault()
                this.mainWindow?.hide()
                console.log('[main] 窗口隐藏到托盘')
            }
        })

        this.mainWindow.on('show', () => {
            console.log('[main] 窗口 show -> focus')
            this.mainWindow?.focus()
        })

        this.mainWindow.on('ready-to-show', () => {
            this.mainWindow?.show()
            console.log('[main] ready-to-show')
        })

        this.mainWindow.on('closed', () => {
            console.log('[main] window closed')
            this.mainWindow = null
        })

        // 阻止新窗口打开
        this.mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
    }

    static toggleVisibility() {
        if (!this.mainWindow) {
            this.createMainWindow()
            return
        }

        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide()
        } else {
            this.mainWindow.show()
            this.mainWindow.focus()
        }
    }

    static getMainWindow() {
        return this.mainWindow
    }
}