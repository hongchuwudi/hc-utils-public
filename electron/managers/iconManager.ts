import { nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'

/**
 * 图标管理类
 */
export class IconManager {
    private static basePath: string

    /**
     * 初始化图标路径
     */
    static initialize(basePath: string): void {
        this.basePath = basePath
        console.log(`[IconManager] 图标基础路径: ${this.basePath}`)
    }

    /**
     * 加载应用图标
     * @param preferredSize 首选尺寸（可选）
     * @returns 原生图像对象
     */
    static loadAppIcon(preferredSize?: number): Electron.NativeImage {
        if (!this.basePath) {
            console.warn('[IconManager] 图标路径未初始化，使用默认图标')
            return this.createDefaultIcon()
        }

        // 如果指定了首选尺寸，优先加载该尺寸
        if (preferredSize) {
            const preferredIcon = this.getIconPath(preferredSize)
            const icon = this.loadIconFromFile(preferredIcon)
            if (!icon.isEmpty()) {
                console.log(`[IconManager] 成功加载首选图标: ${path.basename(preferredIcon)}`)
                return icon
            }
        }

        // 按尺寸优先级加载图标
        const iconSizes = [256, 128, 64, 48, 32, 16]
        for (const size of iconSizes) {
            const iconPath = this.getIconPath(size)
            const icon = this.loadIconFromFile(iconPath)
            if (!icon.isEmpty()) {
                console.log(`[IconManager] 成功加载图标: favicon_${size}.ico`)
                return icon
            }
        }

        // 所有图标加载失败，使用默认图标
        console.warn('[IconManager] 所有图标加载失败，使用默认图标')
        return this.createDefaultIcon()
    }

    /**
     * 获取图标文件路径
     * @param size 图标尺寸
     * @returns 完整的图标文件路径
     */
    private static getIconPath(size: number): string {
        return path.join(this.basePath, `favicon_${size}.ico`)
    }

    /**
     * 从文件加载图标
     * @param iconPath 图标路径
     * @returns 原生图像对象
     */
    private static loadIconFromFile(iconPath: string): Electron.NativeImage {
        try {
            if (fs.existsSync(iconPath)) {
                const icon = nativeImage.createFromPath(iconPath)
                return icon.isEmpty() ? nativeImage.createEmpty() : icon
            }
        } catch (error) {
            console.warn(`[IconManager] 加载图标失败: ${iconPath}`, error)
        }
        return nativeImage.createEmpty()
    }

    /**
     * 创建默认图标（备用）
     * @returns 默认的原生图像对象
     */
    private static createDefaultIcon(): Electron.NativeImage {
        // 创建一个简单的 16x16 红色方形作为默认图标
        const defaultIconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        return nativeImage.createFromDataURL(defaultIconData)
    }

    /**
     * 检查图标文件是否存在
     * @returns 存在的图标尺寸列表
     */
    static checkAvailableIcons(): number[] {
        if (!this.basePath) return []

        const availableSizes: number[] = []
        const iconSizes = [16, 32, 48, 64, 128, 256]

        for (const size of iconSizes) {
            const iconPath = this.getIconPath(size)
            if (fs.existsSync(iconPath)) {
                availableSizes.push(size)
            }
        }

        console.log(`[IconManager] 可用的图标尺寸: ${availableSizes.join(', ')}`)
        return availableSizes
    }

    /**
     * 获取推荐的应用窗口图标尺寸
     * @returns 推荐的图标尺寸
     */
    static getRecommendedWindowIconSize(): number {
        return 256 // 窗口图标推荐使用大尺寸
    }

    /**
     * 获取推荐的托盘图标尺寸
     * @returns 推荐的托盘图标尺寸
     */
    static getRecommendedTrayIconSize(): number {
        return 32 // 托盘图标推荐使用小尺寸
    }
}