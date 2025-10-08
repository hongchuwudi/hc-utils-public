"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconManager = void 0;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * 图标管理类
 */
class IconManager {
    /**
     * 初始化图标路径
     */
    static initialize(basePath) {
        this.basePath = basePath;
        console.log(`[IconManager] 图标基础路径: ${this.basePath}`);
    }
    /**
     * 加载应用图标
     * @param preferredSize 首选尺寸（可选）
     * @returns 原生图像对象
     */
    static loadAppIcon(preferredSize) {
        if (!this.basePath) {
            console.warn('[IconManager] 图标路径未初始化，使用默认图标');
            return this.createDefaultIcon();
        }
        // 如果指定了首选尺寸，优先加载该尺寸
        if (preferredSize) {
            const preferredIcon = this.getIconPath(preferredSize);
            const icon = this.loadIconFromFile(preferredIcon);
            if (!icon.isEmpty()) {
                console.log(`[IconManager] 成功加载首选图标: ${path_1.default.basename(preferredIcon)}`);
                return icon;
            }
        }
        // 按尺寸优先级加载图标
        const iconSizes = [256, 128, 64, 48, 32, 16];
        for (const size of iconSizes) {
            const iconPath = this.getIconPath(size);
            const icon = this.loadIconFromFile(iconPath);
            if (!icon.isEmpty()) {
                console.log(`[IconManager] 成功加载图标: favicon_${size}.ico`);
                return icon;
            }
        }
        // 所有图标加载失败，使用默认图标
        console.warn('[IconManager] 所有图标加载失败，使用默认图标');
        return this.createDefaultIcon();
    }
    /**
     * 获取图标文件路径
     * @param size 图标尺寸
     * @returns 完整的图标文件路径
     */
    static getIconPath(size) {
        return path_1.default.join(this.basePath, `favicon_${size}.ico`);
    }
    /**
     * 从文件加载图标
     * @param iconPath 图标路径
     * @returns 原生图像对象
     */
    static loadIconFromFile(iconPath) {
        try {
            if (fs_1.default.existsSync(iconPath)) {
                const icon = electron_1.nativeImage.createFromPath(iconPath);
                return icon.isEmpty() ? electron_1.nativeImage.createEmpty() : icon;
            }
        }
        catch (error) {
            console.warn(`[IconManager] 加载图标失败: ${iconPath}`, error);
        }
        return electron_1.nativeImage.createEmpty();
    }
    /**
     * 创建默认图标（备用）
     * @returns 默认的原生图像对象
     */
    static createDefaultIcon() {
        // 创建一个简单的 16x16 红色方形作为默认图标
        const defaultIconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        return electron_1.nativeImage.createFromDataURL(defaultIconData);
    }
    /**
     * 检查图标文件是否存在
     * @returns 存在的图标尺寸列表
     */
    static checkAvailableIcons() {
        if (!this.basePath)
            return [];
        const availableSizes = [];
        const iconSizes = [16, 32, 48, 64, 128, 256];
        for (const size of iconSizes) {
            const iconPath = this.getIconPath(size);
            if (fs_1.default.existsSync(iconPath)) {
                availableSizes.push(size);
            }
        }
        console.log(`[IconManager] 可用的图标尺寸: ${availableSizes.join(', ')}`);
        return availableSizes;
    }
    /**
     * 获取推荐的应用窗口图标尺寸
     * @returns 推荐的图标尺寸
     */
    static getRecommendedWindowIconSize() {
        return 256; // 窗口图标推荐使用大尺寸
    }
    /**
     * 获取推荐的托盘图标尺寸
     * @returns 推荐的托盘图标尺寸
     */
    static getRecommendedTrayIconSize() {
        return 32; // 托盘图标推荐使用小尺寸
    }
}
exports.IconManager = IconManager;
