// utils/deviceInfo.js - 优化版本

/**
 * 获取设备信息工具类
 * 返回设备类型、操作系统、浏览器、屏幕信息等
 * 使用特性检测和User Agent分析相结合的方法提高准确性
 */
class DeviceUtils {
    /**
     * 获取完整的设备信息
     * @returns {Object} 设备信息对象
     */
    static getDeviceInfo() {
        return {
            device: this.getDeviceType(),
            os: this.getOSInfo(),
            browser: this.getBrowserInfo(),
            screen: this.getScreenInfo(),
            language: this.getLanguage(),
            timezone: this.getTimezone(),
            network: this.getNetworkInfo(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            cookieEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
            pdfViewerEnabled: this.checkPDFViewerEnabled(),
            touchSupport: this.isTouchSupported(),
            onlineStatus: this.isOnline(),
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            // 新增逻辑分辨率检测
            logicalResolution: this.getLogicalResolution()
        }
    }

    /**
     * 获取设备类型（改进版）
     * @returns {string} mobile | tablet | desktop | smart-tv
     */
    static getDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        const width = window.screen.width;
        const height = window.screen.height;
        const ratio = window.devicePixelRatio || 1;

        // 检测智能电视
        if (ua.includes('smarttv') || ua.includes('smart-tv') || ua.includes('googletv') || ua.includes('appletv')) {
            return 'smart-tv';
        }

        // 检测游戏主机
        if (ua.includes('xbox') || ua.includes('playstation') || ua.includes('nintendo')) {
            return 'game-console';
        }

        // 使用更准确的方法检测移动设备
        const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry|webos|iemobile|opera mini/i.test(ua);
        const isTablet = /ipad|android(?!.*mobile)|tablet|playbook|silk/i.test(ua);

        // 考虑屏幕尺寸和设备像素比
        const logicalWidth = width * ratio;
        const logicalHeight = height * ratio;

        if (isMobile) {
            return 'mobile';
        } else if (isTablet) {
            return 'tablet';
        } else if (logicalWidth <= 1024 && logicalHeight <= 1024 && this.isTouchSupported()) {
            // 小屏幕且支持触摸，可能是平板
            return 'tablet';
        }

        return 'desktop';
    }

    /**
     * 获取操作系统信息（改进版，包含Windows 11）
     * @returns {Object} 操作系统信息
     */
    static getOSInfo() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        let os = 'unknown';
        let version = 'unknown';

        // Windows 检测（包含Windows 11）
        if (/Win/i.test(platform)) {
            os = 'Windows';

            // Windows 11 检测
            if (/Windows NT 10.0; Win64; x64/.test(ua) && !/Windows NT 10.0; WOW64/.test(ua)) {
                // 额外的Windows 11特征检测
                const isWindows11 = ua.includes('Windows NT 10.0') &&
                    (ua.includes('Edg/') || ua.includes('Chrome/')) &&
                    !ua.includes('Windows NT 10.0; WOW64');
                version = isWindows11 ? '11' : '10';
            }
            else if (/Windows NT 6.3/i.test(ua)) {
                version = '8.1';
            } else if (/Windows NT 6.2/i.test(ua)) {
                version = '8';
            } else if (/Windows NT 6.1/i.test(ua)) {
                version = '7';
            } else if (/Windows NT 6.0/i.test(ua)) {
                version = 'Vista';
            } else if (/Windows NT 5.1/i.test(ua)) {
                version = 'XP';
            } else if (/Windows NT 5.0/i.test(ua)) {
                version = '2000';
            } else {
                version = 'unknown version';
            }
        }
        // macOS
        else if (/Mac/i.test(platform)) {
            os = 'macOS';
            // 更准确的macOS版本检测
            const match = /Mac OS X (10[._]\d+)|Mac OS X (1[1-9][._]\d+)|macOS (1[1-9][._]\d+)/i.exec(ua);
            if (match) {
                version = (match[1] || match[2] || match[3]).replace('_', '.');
            } else {
                version = 'unknown version';
            }
        }
        // iOS
        else if (/iPhone|iPad|iPod/i.test(platform)) {
            os = 'iOS';
            const match = /OS (\d+[._]\d+)/i.exec(ua);
            if (match) version = match[1].replace('_', '.');
        }
        // Android
        else if (/Android/i.test(ua)) {
            os = 'Android';
            const match = /Android (\d+[._]\d+)/i.exec(ua);
            if (match) version = match[1];
        }
        // Linux
        else if (/Linux/i.test(platform)) {
            os = 'Linux';
            // 尝试检测Linux发行版
            if (/Ubuntu/i.test(ua)) {
                version = 'Ubuntu';
            } else if (/Fedora/i.test(ua)) {
                version = 'Fedora';
            } else if (/Debian/i.test(ua)) {
                version = 'Debian';
            } else if (/Red Hat/i.test(ua)) {
                version = 'Red Hat';
            } else if (/CentOS/i.test(ua)) {
                version = 'CentOS';
            }
        }
        // Chrome OS
        else if (/CrOS/i.test(ua)) {
            os = 'Chrome OS';
            const match = /CrOS (\d+[._]\d+)/i.exec(ua);
            if (match) version = match[1];
        }

        return { name: os, version };
    }

    /**
     * 获取屏幕信息（改进版，包含逻辑和物理分辨率）
     * @returns {Object} 屏幕信息
     */
    static getScreenInfo() {
        const ratio = window.devicePixelRatio || 1;
        const width = window.screen.width;
        const height = window.screen.height;

        return {
            // 物理分辨率
            physicalWidth: Math.round(width * ratio),
            physicalHeight: Math.round(height * ratio),
            // 逻辑分辨率（CSS像素）
            logicalWidth: width,
            logicalHeight: height,
            // 可用区域
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            // 颜色信息
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            // 方向信息
            orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown',
            // 设备像素比
            devicePixelRatio: ratio,
            // 视口大小（考虑缩放）
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        }
    }

    /**
     * 获取逻辑分辨率（考虑设备像素比）
     * @returns {Object} 逻辑分辨率
     */
    static getLogicalResolution() {
        const ratio = window.devicePixelRatio || 1;
        return {
            width: window.screen.width * ratio,
            height: window.screen.height * ratio,
            devicePixelRatio: ratio
        }
    }

    /**
     * 获取浏览器信息（改进版）
     * @returns {Object} 浏览器信息
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'unknown';
        let version = 'unknown';

        // 按优先级检测浏览器
        // Edge (基于Chromium)
        if (/Edg\/|EdgA\/|EdgiOS\//i.test(ua)) {
            browser = 'Edge (Chromium)';
            const match = /Edg\/(\d+)/i.exec(ua);
            if (match) version = match[1];
        }
        // Chrome
        else if (/Chrome|CriOS/i.test(ua) && !/OPR|Opera|Edg|Edge/i.test(ua)) {
            browser = 'Chrome';
            const match = /(Chrome|CriOS)\/(\d+)/i.exec(ua);
            if (match) version = match[2];
        }
        // Firefox
        else if (/Firefox|FxiOS/i.test(ua)) {
            browser = 'Firefox';
            const match = /(Firefox|FxiOS)\/(\d+)/i.exec(ua);
            if (match) version = match[2];
        }
        // Safari
        else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
            browser = 'Safari';
            const match = /Version\/(\d+)/i.exec(ua);
            if (match) version = match[1];
        }
        // Opera
        else if (/OPR|Opera/i.test(ua)) {
            browser = 'Opera';
            const match = /(OPR|Opera)\/(\d+)/i.exec(ua);
            if (match) version = match[2];
        }
        // IE
        else if (/MSIE|Trident/i.test(ua)) {
            browser = 'IE';
            if (/MSIE (\d+)/i.test(ua)) {
                version = /MSIE (\d+)/i.exec(ua)[1];
            } else if (/Trident\/.*rv:(\d+)/i.test(ua)) {
                version = /Trident\/.*rv:(\d+)/i.exec(ua)[1];
            }
        }
        // Samsung Internet
        else if (/SamsungBrowser/i.test(ua)) {
            browser = 'Samsung Internet';
            const match = /SamsungBrowser\/(\d+)/i.exec(ua);
            if (match) version = match[1];
        }

        return { name: browser, version };
    }

    /**
     * 获取语言信息
     * @returns {string} 浏览器语言
     */
    static getLanguage() {
        return navigator.language || navigator.userLanguage || navigator.browserLanguage || 'unknown';
    }

    /**
     * 获取时区信息
     * @returns {string} 时区
     */
    static getTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            // 备用方法
            const offset = -new Date().getTimezoneOffset() / 60;
            return `UTC${offset >= 0 ? '+' : ''}${offset}`;
        }
    }

    /**
     * 获取网络信息
     * @returns {Object} 网络信息
     */
    static getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            return {
                effectiveType: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 'unknown',
                rtt: connection.rtt || 'unknown',
                saveData: connection.saveData || false,
                type: connection.type || 'unknown'
            }
        }

        return { effectiveType: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false, type: 'unknown' };
    }

    /**
     * 检查是否支持触摸
     * @returns {boolean} 是否支持触摸
     */
    static isTouchSupported() {
        return 'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;
    }

    /**
     * 检查是否在线
     * @returns {boolean} 是否在线
     */
    static isOnline() {
        return navigator.onLine;
    }

    /**
     * 检查PDF查看器是否启用
     * @returns {boolean} 是否启用PDF查看器
     */
    static checkPDFViewerEnabled() {
        // 现代浏览器通常支持PDF查看
        const ua = navigator.userAgent;
        if (/Chrome|Safari|Firefox|Edg/i.test(ua)) {
            return true;
        }

        // IE的PDF查看检测
        if (/MSIE|Trident/i.test(ua)) {
            try {
                return !!new ActiveXObject('AcroPDF.PDF');
            } catch (e) {
                return false;
            }
        }

        return false;
    }

    /**
     * 获取设备信息并转换为JSON字符串
     * @returns {string} JSON字符串
     */
    static getDeviceInfoJSON() {
        return JSON.stringify(this.getDeviceInfo(), null, 2);
    }

    /**
     * 获取设备性能信息
     * @returns {Object} 性能信息
     */
    static getPerformanceInfo() {
        if (!window.performance) return { supported: false };

        return {
            memory: performance.memory ? {
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : 'not supported',
            timing: performance.timing ? {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReadyTime: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                redirectTime: performance.timing.redirectEnd - performance.timing.redirectStart,
                dnsTime: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
                tcpTime: performance.timing.connectEnd - performance.timing.connectStart,
                requestTime: performance.timing.responseEnd - performance.timing.requestStart,
                whiteTime: performance.timing.responseStart - performance.timing.navigationStart
            } : 'not supported'
        };
    }
}

export default DeviceUtils;