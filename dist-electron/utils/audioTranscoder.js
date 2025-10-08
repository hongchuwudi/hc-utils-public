"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioStreamer = void 0;
// electron/utils/audioStreamer.ts
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const stream_1 = require("stream");
const events_1 = require("events");
// 设置 ffmpeg 路径
if (ffmpeg_static_1.default) {
    fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
}
class AudioStreamer extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.streams = new Map();
    }
    // 创建音频转码流
    createAudioStream(filePath, options = {}) {
        const { format = 'mp3', bitrate = '192k', sampleRate = 44100, channels = 2 } = options;
        console.log(`开始创建音频流: ${filePath} -> ${format}`);
        const outputStream = new stream_1.PassThrough();
        const command = (0, fluent_ffmpeg_1.default)(filePath)
            .audioCodec(this.getCodec(format))
            .audioBitrate(bitrate)
            .audioFrequency(sampleRate)
            .audioChannels(channels)
            .format(format)
            .outputOptions([
            '-f', format,
            '-movflags', 'frag_keyframe+empty_moov' // 关键：支持流式播放
        ]);
        command
            .on('start', (commandLine) => {
            console.log('FFmpeg 命令:', commandLine);
            this.emit('start', filePath);
        })
            .on('progress', (progress) => {
            console.log(`转码进度: ${progress.percent}%`);
            this.emit('progress', progress);
        })
            .on('end', () => {
            console.log('音频流转码完成:', filePath);
            this.emit('end', filePath);
            this.streams.delete(filePath);
        })
            .on('error', (err) => {
            console.error('音频流转码错误:', err);
            this.emit('error', err, filePath);
            this.streams.delete(filePath);
        });
        // 管道输出到流
        const ffmpegStream = command.pipe(outputStream, { end: true });
        this.streams.set(filePath, ffmpegStream);
        return ffmpegStream;
    }
    // 获取编码器
    getCodec(format) {
        switch (format) {
            case 'mp3': return 'libmp3lame';
            case 'ogg': return 'libvorbis';
            case 'aac': return 'aac';
            default: return 'libmp3lame';
        }
    }
    // 停止指定文件的流
    stopStream(filePath) {
        const stream = this.streams.get(filePath);
        if (stream) {
            stream.destroy();
            this.streams.delete(filePath);
            console.log('已停止音频流:', filePath);
        }
    }
    // 停止所有流
    stopAllStreams() {
        this.streams.forEach((stream, filePath) => {
            stream.destroy();
            console.log('停止音频流:', filePath);
        });
        this.streams.clear();
    }
}
exports.AudioStreamer = AudioStreamer;
