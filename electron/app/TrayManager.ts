import { Tray, Menu, app } from 'electron'
import { IconManager } from '../managers/iconManager'
import { WindowManager } from './WindowManager'
import { AppManager } from './AppManager'

export class TrayManager {
    public static tray: Tray | null = null

    static initialize() {
        this.createTray()
    }

    private static createTray() {
        const trayIcon = IconManager.loadAppIcon(IconManager.getRecommendedTrayIconSize())
        this.tray = new Tray(trayIcon)
        this.tray.setToolTip('HCUtils-技术创造价值')

        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示/隐藏窗口',
                click: () => this.toggleWindowVisibility()
            },
            { type: 'separator' },
            {
                label: '彻底退出',
                click: () => this.quitApp()
            }
        ])

        this.tray.setContextMenu(contextMenu)
        this.tray.on('click', () => this.toggleWindowVisibility())
    }

    private static toggleWindowVisibility() {
        console.log('[tray] 点击 显示/隐藏窗口')
        WindowManager.toggleVisibility()
    }

    private static quitApp() {
        console.log('[tray] 点击 彻底退出')
        AppManager.isQuitting = true
        if (this.tray) {
            this.tray.destroy()
            this.tray = null
        }
        app.quit()
    }
}