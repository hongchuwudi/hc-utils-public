"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowManager = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const iconManager_1 = require("../managers/iconManager");
const AppManager_1 = require("./AppManager");
class WindowManager {
    static initialize(isDev) {
        this.isDev = isDev;
        this.createMainWindow();
    }
    static createMainWindow() {
        const windowIcon = iconManager_1.IconManager.loadAppIcon(iconManager_1.IconManager.getRecommendedWindowIconSize());
        this.mainWindow = new electron_1.BrowserWindow({
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
                preload: path_1.default.join(__dirname, '../preload.js'),
                webSecurity: false,
            },
            show: false
        });
        // 彻底移除菜单
        this.mainWindow.setMenuBarVisibility(false);
        this.mainWindow.removeMenu();
        // 加载页面
        if (this.isDev) {
            this.mainWindow.loadURL('http://localhost:5173');
            this.mainWindow.webContents.openDevTools();
        }
        else {
            this.mainWindow.loadFile(path_1.default.join(__dirname, '../../dist/index.html'));
        }
        this.setupWindowEvents();
    }
    static setupWindowEvents() {
        if (!this.mainWindow)
            return;
        this.mainWindow.on('close', (event) => {
            console.log('[main] close event fired, isQuitting =', AppManager_1.AppManager.isQuitting);
            if (!AppManager_1.AppManager.isQuitting) {
                event.preventDefault();
                this.mainWindow?.hide();
                console.log('[main] 窗口隐藏到托盘');
            }
        });
        this.mainWindow.on('show', () => {
            console.log('[main] 窗口 show -> focus');
            this.mainWindow?.focus();
        });
        this.mainWindow.on('ready-to-show', () => {
            this.mainWindow?.show();
            console.log('[main] ready-to-show');
        });
        this.mainWindow.on('closed', () => {
            console.log('[main] window closed');
            this.mainWindow = null;
        });
        // 阻止新窗口打开
        this.mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    }
    static toggleVisibility() {
        if (!this.mainWindow) {
            this.createMainWindow();
            return;
        }
        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        }
        else {
            this.mainWindow.show();
            this.mainWindow.focus();
        }
    }
    static getMainWindow() {
        return this.mainWindow;
    }
}
exports.WindowManager = WindowManager;
WindowManager.mainWindow = null;
WindowManager.isDev = false;
