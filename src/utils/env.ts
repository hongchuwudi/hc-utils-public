// @/utils/env.ts
import { message } from 'ant-design-vue'

export const isElectron = (): boolean => {
    return !!(window.electronAPI && window.electronAPI.openExternal)
}

export const openExternalLink = async (url: string): Promise<boolean> => {
    try {
        // 检查是否是有效的 URL
        if (!url || !url.startsWith('http')) {
            message.error('无效的链接地址')
            return false
        }

        // Electron 环境
        if (window.electronAPI?.openExternal) {
            const result = await window.electronAPI.openExternal(url)
            if (result.success) {
                return true
            } else {
                message.error(result.error || '打开链接失败')
                return false
            }
        } else {
            // 浏览器环境
            return openLinkInBrowser(url)
        }
    } catch (error) {
        console.error('打开链接失败:', error)
        message.error('打开链接失败')
        return false
    }
}

// 浏览器环境下打开链接
const openLinkInBrowser = (url: string): boolean => {
    try {
        // 方法1: 尝试直接打开
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')

        if (newWindow) {
            return true
        }

        // 方法2: 如果被阻止，使用用户交互触发的方式
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // 检查是否成功（通过检查焦点变化）
        setTimeout(() => {
            // 如果还是没打开，显示美观的模态框
            showLinkModal(url)
        }, 100)

        return true

    } catch (error) {
        console.error('打开链接失败:', error)
        showLinkModal(url)
        return false
    }
}

// 显示美观的链接模态框
const showLinkModal = (url: string) => {
    // 如果已经存在模态框，先移除
    const existingModal = document.getElementById('external-link-modal')
    if (existingModal) {
        document.body.removeChild(existingModal)
    }

    // 创建模态框
    const modal = document.createElement('div')
    modal.id = 'external-link-modal'
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center'

    // 背景层
    const backdrop = document.createElement('div')
    backdrop.className = 'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out opacity-0'

    // 内容层
    const content = document.createElement('div')
    content.className = 'relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mx-4 max-w-md w-full border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-out scale-95 opacity-0 translate-y-4'

    content.innerHTML = `
        <!-- 图标和标题 -->
        <div class="flex items-center gap-3 mb-4">
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
            </div>
            <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">打开外部链接</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">浏览器阻止了自动打开</p>
            </div>
        </div>

        <!-- 链接显示区域 -->
        <div class="mb-6">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">请手动访问以下链接：</p>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                <p class="text-sm text-blue-600 dark:text-blue-400 break-all font-mono">${url}</p>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3 justify-end">
            <button id="copy-link-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium active:scale-95 hover:shadow-lg">
                <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                复制链接
            </button>
            <button id="close-modal-btn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 text-sm font-medium active:scale-95">
                取消
            </button>
        </div>
    `

    modal.appendChild(backdrop)
    modal.appendChild(content)
    document.body.appendChild(modal)

    // 添加动画类
    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0')
        content.classList.remove('scale-95', 'opacity-0', 'translate-y-4')
        backdrop.classList.add('opacity-100')
        content.classList.add('scale-100', 'opacity-100', 'translate-y-0')
    })

    // 关闭模态框的函数
    const closeModal = () => {
        backdrop.classList.remove('opacity-100')
        backdrop.classList.add('opacity-0')
        content.classList.remove('scale-100', 'opacity-100', 'translate-y-0')
        content.classList.add('scale-95', 'opacity-0', 'translate-y-4')

        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal)
            }
            document.removeEventListener('keydown', handleKeydown)
        }, 300)
    }

    // 复制链接按钮事件
    document.getElementById('copy-link-btn')?.addEventListener('click', async () => {
        try {
            const success = await copyToClipboard(url)
            if (success) {
                // 更新按钮状态和添加成功动画
                const copyBtn = document.getElementById('copy-link-btn') as HTMLButtonElement
                const copyIcon = copyBtn.querySelector('svg')
                if (copyBtn && copyIcon) {
                    // 添加成功动画
                    copyBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700')
                    copyBtn.classList.add('bg-green-600', 'hover:bg-green-700')
                    copyBtn.innerHTML = `
                        <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        已复制
                    `
                    copyBtn.disabled = true

                    // 添加链接区域的成功反馈
                    const linkContainer = content.querySelector('div > div') as HTMLElement
                    if (linkContainer) {
                        linkContainer.classList.add('ring-2', 'ring-green-500', 'ring-opacity-50')
                    }
                }

                setTimeout(() => {
                    closeModal()
                }, 1500)
            } else {
                message.error('复制失败，请手动复制链接')
            }
        } catch (copyError) {
            message.error('复制失败，请手动复制链接')
        }
    })

    // 关闭按钮事件
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal)

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            closeModal()
        }
    })

    // ESC 键关闭
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeModal()
        }
    }
    document.addEventListener('keydown', handleKeydown)
}

// 复制到剪贴板的辅助函数
const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        } else {
            // 降级方案
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            const success = document.execCommand('copy')
            document.body.removeChild(textArea)
            return success
        }
    } catch {
        return false
    }
}

// 导出环境工具函数
export const getPlatform = (): string => window.electronAPI?.platform || navigator.platform.toLowerCase()
export const isWindows = (): boolean => getPlatform().includes('win')
export const isMac = (): boolean => getPlatform().includes('mac')
export const isLinux = (): boolean => getPlatform().includes('linux')

export default {
    isElectron,
    openExternalLink,
    getPlatform,
    isWindows,
    isMac,
    isLinux
}