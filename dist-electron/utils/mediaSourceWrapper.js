"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaSourceWrapper = void 0;
// electron/utils/mediaSourceWrapper.ts
class MediaSourceWrapper {
    constructor() {
        this.sourceBuffer = null;
        this.isUpdating = false;
        this.bufferQueue = [];
        this.mediaSource = new MediaSource();
        this.setupMediaSource();
    }
    setupMediaSource() {
        this.mediaSource.addEventListener('sourceopen', () => {
            console.log('MediaSource 已打开');
            this.initializeSourceBuffer();
        });
        this.mediaSource.addEventListener('sourceended', () => {
            console.log('MediaSource 已结束');
        });
        this.mediaSource.addEventListener('sourceclose', () => {
            console.log('MediaSource 已关闭');
        });
    }
    initializeSourceBuffer() {
        // 创建 MP3 格式的 SourceBuffer
        const mimeType = 'audio/mpeg';
        if (MediaSource.isTypeSupported(mimeType)) {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
            this.sourceBuffer.mode = 'sequence';
            this.sourceBuffer.addEventListener('updateend', () => {
                this.isUpdating = false;
                this.processQueue();
            });
            this.sourceBuffer.addEventListener('error', (e) => {
                console.error('SourceBuffer 错误:', e);
            });
            console.log('SourceBuffer 初始化完成');
        }
        else {
            console.error('不支持的 MIME 类型:', mimeType);
        }
    }
    // 添加数据到缓冲区
    appendBuffer(data) {
        if (this.sourceBuffer && !this.isUpdating) {
            this.isUpdating = true;
            this.sourceBuffer.appendBuffer(data);
        }
        else {
            this.bufferQueue.push(data);
        }
    }
    // 处理队列中的数据
    processQueue() {
        if (this.bufferQueue.length > 0 && this.sourceBuffer && !this.isUpdating) {
            this.isUpdating = true;
            const data = this.bufferQueue.shift();
            this.sourceBuffer.appendBuffer(data);
        }
    }
    // 结束流
    endStream() {
        if (this.mediaSource.readyState === 'open') {
            this.mediaSource.endOfStream();
        }
    }
    // 获取 MediaSource URL
    getObjectURL() {
        return URL.createObjectURL(this.mediaSource);
    }
    // 清理资源
    destroy() {
        if (this.sourceBuffer) {
            this.sourceBuffer.abort();
        }
        this.mediaSource.endOfStream();
        URL.revokeObjectURL(this.getObjectURL());
    }
}
exports.MediaSourceWrapper = MediaSourceWrapper;
