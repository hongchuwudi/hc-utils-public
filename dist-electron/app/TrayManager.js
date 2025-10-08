"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrayManager = void 0;
const electron_1 = require("electron");
const iconManager_1 = require("../managers/iconManager");
const WindowManager_1 = require("./WindowManager");
const AppManager_1 = require("./AppManager");
class TrayManager {
    static initialize() {
        this.createTray();
    }
    static createTray() {
        const trayIcon = iconManager_1.IconManager.loadAppIcon(iconManager_1.IconManager.getRecommendedTrayIconSize());
        this.tray = new electron_1.Tray(trayIcon);
        this.tray.setToolTip('HCUtils-技术创造价值');
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: '显示/隐藏窗口',
                click: () => this.toggleWindowVisibility()
            },
            { type: 'separator' },
            {
                label: '彻底退出',
                click: () => this.quitApp()
            }
        ]);
        this.tray.setContextMenu(contextMenu);
        this.tray.on('click', () => this.toggleWindowVisibility());
    }
    static toggleWindowVisibility() {
        console.log('[tray] 点击 显示/隐藏窗口');
        WindowManager_1.WindowManager.toggleVisibility();
    }
    static quitApp() {
        console.log('[tray] 点击 彻底退出');
        AppManager_1.AppManager.isQuitting = true;
        if (this.tray) {
            this.tray.destroy();
            this.tray = null;
        }
        electron_1.app.quit();
    }
}
exports.TrayManager = TrayManager;
TrayManager.tray = null;
