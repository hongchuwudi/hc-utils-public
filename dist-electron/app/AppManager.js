"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppManager = void 0;
const WindowManager_1 = require("./WindowManager");
const TrayManager_1 = require("./TrayManager");
const IpcHandler_1 = require("./IpcHandler");
const iconManager_1 = require("../managers/iconManager");
const path_1 = __importDefault(require("path"));
class AppManager {
    // 初始化应用
    static initialize(isDev) {
        this.isDev = isDev;
        this.initializeIconManager(); // 初始化图标管理器
        WindowManager_1.WindowManager.initialize(this.isDev); // 初始化窗口
        TrayManager_1.TrayManager.initialize(); // 初始化托盘
        IpcHandler_1.IpcHandler.initialize(); // 初始化IPC处理器
    }
    // 初始化图标管理器
    static initializeIconManager() {
        const iconBasePath = this.isDev
            ? path_1.default.join(__dirname, '../../public/icos') //  开发环境
            : path_1.default.join(__dirname, '../../public/icos'); //  生产环境
        iconManager_1.IconManager.initialize(iconBasePath);
        iconManager_1.IconManager.checkAvailableIcons();
    }
}
exports.AppManager = AppManager;
AppManager.isQuitting = false;
AppManager.isDev = false; // 是否为开发环境(默认生产环境)
