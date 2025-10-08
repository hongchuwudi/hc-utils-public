"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadManager = void 0;
// electron/utils/downloadManager.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
class DownloadManager {
    // 生成标准化的文件名（不包含时间戳）
    static generateFileName(musicInfo, extension = '') {
        if (!musicInfo) {
            console.error('musicInfo is null or undefined');
            return 'Unknown_Song' + extension;
        }
        const parts = [
            musicInfo.title,
            musicInfo.singer,
            musicInfo.source,
            musicInfo.quality
        ];
        const safeParts = parts.map(part => this.safeString(part));
        return safeParts.join('_') + extension;
    }
    // 安全处理字符串，防止 undefined 和 null
    // 安全处理字符串，防止 undefined 和 null
    static safeString(str) {
        if (str === null || str === undefined)
            return 'Unknown';
        try {
            // 确保是字符串类型
            const stringValue = typeof str === 'string' ? str : String(str);
            return stringValue.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
        }
        catch (error) {
            console.error('字符串处理错误:', error, '原始值:', str);
            return 'Unknown';
        }
    }
    // 检查文件是否存在
    static fileExists(filePath) {
        try {
            return fs_1.default.existsSync(filePath);
        }
        catch (error) {
            console.error('检查文件存在时出错:', error);
            return false;
        }
    }
    // 删除文件
    static deleteFile(filePath) {
        try {
            if (this.fileExists(filePath)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`已删除文件: ${filePath}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('删除文件失败:', error);
            return false;
        }
    }
    // 删除目录
    static deleteDirectory(dirPath) {
        try {
            if (fs_1.default.existsSync(dirPath)) {
                fs_1.default.rmSync(dirPath, { recursive: true, force: true });
                console.log(`已删除目录: ${dirPath}`);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('删除目录失败:', error);
            return false;
        }
    }
    // 下载单个文件（通用方法）
    static async downloadFile(options) {
        const { url, filename, savePath } = options;
        console.log('=== 开始下载文件 ===');
        console.log('URL:', url);
        console.log('文件名:', filename);
        console.log('保存路径:', savePath);
        return new Promise((resolve) => {
            try {
                // 确保目录存在
                if (!fs_1.default.existsSync(savePath)) {
                    fs_1.default.mkdirSync(savePath, { recursive: true });
                    console.log('创建保存目录:', savePath);
                }
                const filePath = path_1.default.join(savePath, filename);
                console.log('完整文件路径:', filePath);
                // 检查文件是否已存在，存在就删除
                if (this.fileExists(filePath)) {
                    console.log('文件已存在，准备覆盖:', filePath);
                    if (!this.deleteFile(filePath)) {
                        console.error('无法删除已存在的文件:', filePath);
                        resolve(false);
                        return;
                    }
                }
                const file = fs_1.default.createWriteStream(filePath);
                console.log('创建文件写入流');
                // 选择协议
                const protocol = url.startsWith('https') ? https_1.default : http_1.default;
                console.log('使用协议:', url.startsWith('https') ? 'HTTPS' : 'HTTP');
                const request = protocol.get(url, (response) => {
                    console.log('响应状态码:', response.statusCode);
                    console.log('响应头:', response.headers);
                    if (response.statusCode !== 200) {
                        console.error(`下载失败，状态码: ${response.statusCode}`, url);
                        this.safeDeleteFile(filePath);
                        resolve(false);
                        return;
                    }
                    response.pipe(file);
                    console.log('开始传输数据...');
                    file.on('finish', () => {
                        console.log('文件下载完成:', filePath);
                        file.close();
                        resolve(true);
                    });
                    file.on('error', (err) => {
                        console.error('文件写入错误:', err);
                        this.safeDeleteFile(filePath);
                        resolve(false);
                    });
                });
                request.on('error', (err) => {
                    console.error('下载请求错误:', err);
                    this.safeDeleteFile(filePath);
                    resolve(false);
                });
                request.setTimeout(30000, () => {
                    console.error('下载超时');
                    request.destroy();
                    this.safeDeleteFile(filePath);
                    resolve(false);
                });
            }
            catch (error) {
                console.error('下载过程出错:', error);
                resolve(false);
            }
        });
    }
    // 下载封面图片
    static async downloadCover(coverUrl, savePath, fileName = 'cover') {
        if (!coverUrl) {
            console.log('没有封面URL，跳过下载封面');
            return null;
        }
        try {
            // 获取封面文件扩展名
            const coverExt = this.getImageExtension(coverUrl);
            const coverFileName = `${fileName}${coverExt}`;
            const coverFilePath = path_1.default.join(savePath, coverFileName);
            console.log(`开始下载封面: ${coverUrl}`);
            const success = await this.downloadFile({
                url: coverUrl,
                filename: coverFileName,
                savePath: savePath
            });
            if (success) {
                console.log(`封面下载完成: ${coverFilePath}`);
                return coverFilePath;
            }
            else {
                console.error('封面下载失败');
                return null;
            }
        }
        catch (error) {
            console.error('下载封面过程出错:', error);
            return null;
        }
    }
    // 获取图片文件扩展名
    static getImageExtension(imageUrl) {
        if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg'))
            return '.jpg';
        if (imageUrl.includes('.png'))
            return '.png';
        if (imageUrl.includes('.gif'))
            return '.gif';
        if (imageUrl.includes('.webp'))
            return '.webp';
        return '.jpg'; // 默认
    }
    // 安全删除文件
    static safeDeleteFile(filePath) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (e) {
            console.warn('删除文件失败:', e);
        }
    }
    // 检查音乐文件是否已存在
    static checkMusicExists(musicInfo, savePath) {
        const fileNameBase = this.generateFileName(musicInfo);
        const possibleExtensions = ['.mp3', '.flac', '.m4a', '.wav'];
        for (const ext of possibleExtensions) {
            const filePath = path_1.default.join(savePath, fileNameBase + ext);
            if (this.fileExists(filePath)) {
                return true;
            }
        }
        return false;
    }
    // 获取音乐文件扩展名
    static getMusicExtension(musicUrl) {
        if (musicUrl.includes('.flac'))
            return '.flac';
        if (musicUrl.includes('.m4a'))
            return '.m4a';
        if (musicUrl.includes('.wav'))
            return '.wav';
        return '.mp3';
    }
    // 下载音乐（包含封面）
    static async downloadMusic(options) {
        const { musicUrl, musicInfo, savePath } = options;
        try {
            console.log('开始下载音乐，接收到的 musicInfo:', JSON.stringify(musicInfo, null, 2));
            // 验证必要字段
            if (!musicInfo.title || !musicInfo.singer || !musicInfo.source || !musicInfo.quality) {
                console.error('音乐信息缺少必要字段:', {
                    title: musicInfo.title,
                    singer: musicInfo.singer,
                    source: musicInfo.source,
                    quality: musicInfo.quality
                });
                return false;
            }
            // 创建主目录
            if (!fs_1.default.existsSync(savePath)) {
                fs_1.default.mkdirSync(savePath, { recursive: true });
            }
            // 创建信息子目录
            const infoDir = path_1.default.join(savePath, 'music_infos');
            if (!fs_1.default.existsSync(infoDir)) {
                fs_1.default.mkdirSync(infoDir, { recursive: true });
            }
            // 生成文件名（不含扩展名）
            const fileNameBase = this.generateFileName(musicInfo);
            console.log('生成的文件名:', fileNameBase);
            // 创建歌曲信息目录
            const songInfoDir = path_1.default.join(infoDir, fileNameBase);
            if (!fs_1.default.existsSync(songInfoDir)) {
                fs_1.default.mkdirSync(songInfoDir, { recursive: true });
            }
            // 检查文件是否已存在
            if (this.checkMusicExists(musicInfo, savePath)) {
                console.log('检测到重复文件，准备覆盖下载');
                // 删除可能存在的旧文件（不同格式）
                const possibleExtensions = ['.mp3', '.flac', '.m4a', '.wav'];
                for (const ext of possibleExtensions) {
                    const musicFilePath = path_1.default.join(savePath, fileNameBase + ext);
                    this.deleteFile(musicFilePath);
                }
                // 删除可能存在的歌曲信息目录
                this.deleteDirectory(songInfoDir);
                // 重新创建歌曲信息目录
                if (!fs_1.default.existsSync(songInfoDir)) {
                    fs_1.default.mkdirSync(songInfoDir, { recursive: true });
                }
            }
            // 1. 下载音乐文件
            const musicExt = this.getMusicExtension(musicUrl);
            const musicFileName = fileNameBase + musicExt;
            console.log(`开始下载音乐文件: ${musicFileName}`);
            const downloadSuccess = await this.downloadFile({
                url: musicUrl,
                filename: musicFileName,
                savePath: savePath
            });
            if (!downloadSuccess) {
                console.error('音乐文件下载失败');
                return false;
            }
            // 2. 下载封面图片到歌曲信息目录
            let localCoverPath = null;
            if (musicInfo.cover) {
                const coverFileName = await this.downloadCover(musicInfo.cover, songInfoDir, 'cover');
                if (coverFileName) {
                    // 只保存相对于音乐存储目录的路径
                    const relativePath = path_1.default.relative(savePath, path_1.default.join(songInfoDir, coverFileName));
                    localCoverPath = relativePath;
                    console.log(`保存封面相对路径: ${relativePath}`);
                }
            }
            // 3. 保存音乐元数据
            const metaData = {
                title: musicInfo.title,
                singer: musicInfo.singer,
                quality: musicInfo.quality,
                source: musicInfo.source,
                cover: musicInfo.cover, // 保留原始封面URL
                localCover: localCoverPath, // 新增本地封面路径
                link: musicInfo.link,
                lyric: musicInfo.lyric,
                musicFile: musicFileName
            };
            const metaDataPath = path_1.default.join(songInfoDir, 'metadata.json');
            fs_1.default.writeFileSync(metaDataPath, JSON.stringify(metaData, null, 2));
            console.log('下载完成，返回 true');
            return true;
        }
        catch (error) {
            console.error('下载音乐过程出错:', error);
            return false;
        }
    }
    // 扫描已下载的歌曲
    static scanDownloadedMusic(savePath) {
        const fs = require('fs');
        const path = require('path');
        const downloadedSongs = [];
        const musicInfosDir = path.join(savePath, 'music_infos');
        console.log('开始扫描下载目录:', savePath);
        if (!fs.existsSync(savePath)) {
            console.log('下载目录不存在:', savePath);
            return downloadedSongs;
        }
        try {
            // 1. 首先扫描所有音频文件
            const audioFiles = [];
            const supportedExtensions = ['.mp3', '.flac', '.m4a', '.wav'];
            const files = fs.readdirSync(savePath);
            for (const file of files) {
                const filePath = path.join(savePath, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    if (supportedExtensions.includes(ext)) {
                        audioFiles.push(file);
                        console.log(`找到音频文件: ${file}`);
                    }
                }
            }
            console.log(`共找到 ${audioFiles.length} 个音频文件`);
            // 2. 为每个音频文件查找对应的元数据
            for (const audioFile of audioFiles) {
                const fileNameWithoutExt = path.basename(audioFile, path.extname(audioFile));
                const musicFilePath = path.join(savePath, audioFile);
                // 查找对应的元数据目录
                const possibleInfoDirs = [
                    path.join(musicInfosDir, fileNameWithoutExt),
                    // 兼容旧版本：可能没有音质信息的文件名
                    path.join(musicInfosDir, fileNameWithoutExt.replace(/_[^_]+$/, ''))
                ];
                let metadata = null;
                let metadataDir = null;
                for (const infoDir of possibleInfoDirs) {
                    const metadataPath = path.join(infoDir, 'metadata.json');
                    if (fs.existsSync(metadataPath)) {
                        try {
                            const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
                            metadata = JSON.parse(metadataContent);
                            metadataDir = infoDir;
                            console.log(`找到元数据: ${metadataPath}`);
                            break;
                        }
                        catch (error) {
                            console.error(`解析metadata失败: ${metadataPath}`, error);
                        }
                    }
                }
                // 3. 创建歌曲信息
                const stats = fs.statSync(musicFilePath);
                if (metadata) {
                    // 有元数据的情况：使用元数据中的信息
                    let coverUrl = null;
                    // 优先使用本地封面
                    let localCoverValue = null;
                    if (metadata.localCover) {
                        try {
                            // 检查是否是有效的相对路径
                            const fullCoverPath = path.join(savePath, metadata.localCover);
                            console.log(`构建封面路径: ${savePath} + ${metadata.localCover} = ${fullCoverPath}`);
                            if (fs.existsSync(fullCoverPath)) {
                                coverUrl = `file://${fullCoverPath}`;
                                localCoverValue = `file://${fullCoverPath}`; // 保存完整路径
                                console.log(`封面文件存在: ${fullCoverPath}`);
                            }
                            else {
                                console.warn(`封面文件不存在: ${fullCoverPath}`);
                                coverUrl = metadata.cover || null;
                                localCoverValue = null;
                            }
                        }
                        catch (error) {
                            console.error(`封面路径处理错误: ${metadata.localCover}`, error);
                            coverUrl = metadata.cover || null;
                            localCoverValue = null;
                        }
                    }
                    else if (metadata.cover) {
                        coverUrl = metadata.cover;
                        localCoverValue = null;
                    }
                    downloadedSongs.push({
                        id: path.basename(metadataDir || fileNameWithoutExt),
                        title: metadata.title || '未知标题',
                        singer: metadata.singer || '未知歌手',
                        source: metadata.source || '未知来源',
                        quality: metadata.quality || '未知音质',
                        n: downloadedSongs.length + 1,
                        cover: coverUrl,
                        link: metadata.link,
                        lyric: metadata.lyric,
                        music_url: `file://${musicFilePath}`,
                        filePath: musicFilePath,
                        downloadTime: stats.birthtime.toISOString(),
                        fileSize: stats.size,
                        localCover: localCoverValue
                    });
                    console.log(`加载歌曲(有元数据): ${metadata.title} - ${metadata.singer}`);
                }
                else {
                    // 没有元数据的情况：使用默认信息
                    let defaultTitle = fileNameWithoutExt;
                    let defaultSinger = '未知歌手';
                    // 尝试拆分文件名（支持 歌名-艺人 格式）
                    const dashSplit = fileNameWithoutExt.split('-');
                    if (dashSplit.length >= 2) {
                        // 格式：歌名-艺人
                        defaultTitle = dashSplit[0].trim();
                        defaultSinger = dashSplit[1].trim();
                    }
                    else {
                        // 尝试下划线分割（兼容原有逻辑）
                        const underscoreSplit = fileNameWithoutExt.split('_');
                        if (underscoreSplit.length >= 2) {
                            defaultTitle = underscoreSplit[0].trim();
                            defaultSinger = underscoreSplit[1].trim();
                        }
                        else {
                            // 如果都没有分隔符，直接使用文件名作为标题
                            defaultTitle = fileNameWithoutExt;
                            defaultSinger = '未知歌手';
                        }
                    }
                    downloadedSongs.push({
                        id: fileNameWithoutExt,
                        title: defaultTitle,
                        singer: defaultSinger,
                        source: '本地文件',
                        quality: '未知',
                        n: downloadedSongs.length + 1,
                        cover: null, // 没有封面
                        link: null,
                        lyric: null,
                        music_url: `file://${musicFilePath}`,
                        filePath: musicFilePath,
                        downloadTime: stats.birthtime.toISOString(),
                        fileSize: stats.size,
                        localCover: null
                    });
                    console.log(`加载歌曲(默认信息): ${defaultTitle} - ${defaultSinger}`);
                }
            }
            console.log(`扫描完成，共加载 ${downloadedSongs.length} 首歌曲`);
            return downloadedSongs;
        }
        catch (error) {
            console.error('扫描下载歌曲失败:', error);
            return [];
        }
    }
    // 删除下载的歌曲
    static deleteDownloadedMusic(savePath, songId) {
        const fs = require('fs');
        const path = require('path');
        try {
            const musicInfosDir = path.join(savePath, 'music_infos');
            const songInfoDir = path.join(musicInfosDir, songId);
            const metadataPath = path.join(songInfoDir, 'metadata.json');
            console.log(`尝试删除歌曲: ${songId}`);
            let deleted = false;
            // 1. 先尝试通过 metadata.json 删除
            if (fs.existsSync(metadataPath)) {
                try {
                    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
                    const musicFilePath = path.join(savePath, metadata.musicFile);
                    // 删除音乐文件
                    if (fs.existsSync(musicFilePath)) {
                        fs.unlinkSync(musicFilePath);
                        console.log(`已删除音乐文件: ${musicFilePath}`);
                        deleted = true;
                    }
                    // 删除封面文件
                    if (metadata.localCover) {
                        const coverPath = path.join(savePath, metadata.localCover);
                        if (fs.existsSync(coverPath)) {
                            fs.unlinkSync(coverPath);
                            console.log(`已删除封面文件: ${coverPath}`);
                        }
                    }
                }
                catch (error) {
                    console.error('解析 metadata.json 失败:', error);
                }
            }
            else {
                console.warn(`metadata.json 不存在: ${metadataPath}`);
            }
            // 2. 如果通过 metadata 没找到文件，直接搜索并删除对应文件名的歌曲
            if (!deleted) {
                console.log('通过 metadata 未找到文件，开始搜索对应文件名的歌曲...');
                const supportedExtensions = ['.mp3', '.flac', '.m4a', '.wav'];
                for (const ext of supportedExtensions) {
                    const possibleMusicFile = path.join(savePath, songId + ext);
                    if (fs.existsSync(possibleMusicFile)) {
                        fs.unlinkSync(possibleMusicFile);
                        console.log(`已删除音乐文件: ${possibleMusicFile}`);
                        deleted = true;
                        break;
                    }
                }
            }
            // 3. 删除信息目录（如果存在）
            if (fs.existsSync(songInfoDir)) {
                fs.rmSync(songInfoDir, { recursive: true, force: true });
                console.log(`已删除信息目录: ${songInfoDir}`);
                deleted = true;
            }
            if (!deleted) {
                console.warn(`未找到歌曲文件或元数据: ${songId}`);
            }
            return deleted;
        }
        catch (error) {
            console.error('删除下载歌曲失败:', error);
            return false;
        }
    }
}
exports.DownloadManager = DownloadManager;
