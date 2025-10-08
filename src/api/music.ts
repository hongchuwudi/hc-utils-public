import request from '../utils/request'
import { urls } from "./url_info.ts";

// 统一响应格式接口定义
export interface UnifiedMusicItem {
    n: number;
    title: string;
    singer: string;
    id: string | number;
    quality?: string;
    cover?: string;
    link?: string;
    music_url?: string;
    lyric?: string;
    source: 'qq' | 'wyy' | 'kw' | 'qishui'; // 来源标识
    lyric_url?: string
    [key: string]: any  // 允许其他未知属性
}
export interface UnifiedSearchResponse {
    code: number;
    data: UnifiedMusicItem[];
    source: string;
}
export interface UnifiedDetailResponse {
    code: number;
    data: UnifiedMusicItem;
    source: string;
}

// 统一搜索API 和 统一详情API
export const searchMusic = async (songName: string, source: 'qq' | 'wyy' | 'kw' | 'qishui' = 'qq'): Promise<UnifiedSearchResponse> => {
    switch (source) {
        case 'qq':     return await searchQQMusic(songName);
        case 'wyy':    return await searchWYYMusic(songName);
        case 'kw':     return await searchKWMusic(songName);
        case 'qishui': return await searchQishuiMusic(songName);
        default:       return await searchQQMusic(songName);
    }
}
export const getMusicDetail = async (songName: string, source: 'qq' | 'wyy' | 'kw' | 'qishui' = 'qq', options: { br?: string, n?: number } = {}): Promise<UnifiedDetailResponse> => {
    switch (source) {
        case 'qq':      return await detailQQMusic(songName, options);
        case 'wyy':     return await detailWYYMusic(songName, options);
        case 'kw':      return await detailKWMusic(songName, options);
        case 'qishui':  return await detailQishuiMusic(songName, options);
        default:        return await detailQQMusic(songName, options);
    }
}


const qqMusicUrl = urls["qqMusicUrl"]; // QQ音乐适配
const wyyMusicUrl = urls["wangyiMusicUrl"];     // 网易云音乐适配
const kwUrl = urls["kuWoMusicUrl"];             // 酷我音乐适配
const qishuiMusicUrl = urls["qishuiMusicUrl"];  // 汽水音乐适配

// 各平台API实现（已适配统一格式）
const searchQQMusic = async (songName: string): Promise<UnifiedSearchResponse> => {
    const response = await request.get(qqMusicUrl.url, {
        params: {
            key: qqMusicUrl.key,
            msg: songName,
            type: 'json',
            num: 60,
        }
    }) as any

    return {
        code: response.code,
        data: response.data.map((item: any) => ({
            n: item.n,
            title: item.song_title || item.title,
            singer: item.song_singer || item.singer,
            id: item.songid || item.id || item.n,
            source: 'qq'
        })),
        source: 'qq'
    };
}
const detailQQMusic = async (songName: string, options: { br?: string, n?: number } = {}): Promise<UnifiedDetailResponse> => {
    const response = await request.get(qqMusicUrl.url, {
        params: {
            key: qqMusicUrl.key,
            msg: songName,
            type: 'json',
            br: options.br || 'flac',
            num: 60,
            n: options.n || 1,
        }
    }) as any

    return {
        code: response.code,
        data: {
            n: options.n || 1,
            title: response.data.song_name,
            singer: response.data.song_singer,
            id: response.data.songid || options.n || 1,
            quality: response.data.quality,
            cover: response.data.cover,
            link: response.data.link,
            music_url: response.data.music_url,
            lyric: response.data.lyric,
            source: 'qq'
        },
        source: 'qq'
    };
}

// 网易云音乐适配
const searchWYYMusic = async (songName: string): Promise<UnifiedSearchResponse> => {
    const response = await request.get(wyyMusicUrl.url, {
        params: {
            key: wyyMusicUrl.key,
            gm: songName,
            type: 'json',
            num: 30,
        }
    }) as any

    return {
        code: response.code,
        data: response.data.map((item: any) => ({
            n: item.n,
            title: item.title,
            singer: item.singer,
            id: item.songid,
            source: 'wyy'
        })),
        source: 'wyy'
    };
}
const detailWYYMusic = async (songName: string, options: { br?: string, n?: number } = {}): Promise<UnifiedDetailResponse> => {
    const response = await request.get(wyyMusicUrl.url, {
        params: {
            key: wyyMusicUrl.key,
            gm: songName,
            type: 'json',
            br: options.br || '1',
            num: 60,
            n: options.n || 1,
        }
    }) as any

    return {
        code: response.code,
        data: {
            n: options.n || 1,
            title: response.title,
            singer: response.singer,
            id: response.id || options.n || 1,
            quality: response.id,
            cover: response.cover,
            link: response.link,
            music_url: response.music_url,
            lyric: response.lrc,
            source: 'wyy'
        },
        source: 'wyy'
    };
}

// 酷我音乐适配
const searchKWMusic = async (songName: string): Promise<UnifiedSearchResponse> => {
    const response = await request.get(kwUrl.url, {
        params: {
            key: kwUrl.key,
            msg: songName,
            type: 'json',
            num: 60,
        }
    }) as any

    return {
        code: response.code,
        data: response.data.map((item: any) => ({
            n: item.n,
            title: item.songname || item.title,
            singer: item.singer,
            id: item.song_rid || item.id,
            source: 'kw'
        })),
        source: 'kw'
    };
}
const detailKWMusic = async (songName: string, options: { br?: string, n?: number } = {}): Promise<UnifiedDetailResponse> => {
    const response = await request.get(kwUrl.url, {
        params: {
            key: kwUrl.key,
            msg: songName,
            type: 'json',
            br: options.br || 'flac',
            num: 60,
            n: options.n || 1,
        }
    }) as any

    return {
        code: parseInt(response.code),
        data: {
            n: options.n || 1,
            title: response.song_name, // 注意：这里应该是 response.data
            singer: response.song_singer,
            id: options.n || 1,
            cover: response.cover,
            link: response.link,
            music_url: response.flac_url || response.music_url,
            source: 'kw'
        },
        source: 'kw'
    };
}

// 汽水音乐适配
const searchQishuiMusic = async (songName: string): Promise<UnifiedSearchResponse> => {
    const response = await request.get(qishuiMusicUrl.url, {
        params: {
            msg: songName,
            type: 'json',
        }
    }) as any

    return {
        code: response.code,
        data: response.data.map((item: any) => ({
            n: item.n,
            title: item.title,
            singer: item.singer,
            id: item.track_id || item.n,
            source: 'qishui'
        })),
        source: 'qishui'
    };
}
const detailQishuiMusic = async (songName: string, options: { n?: number } = {}): Promise<UnifiedDetailResponse> => {
    const response = await request.get(qishuiMusicUrl.url, {
        params: {
            msg: songName,
            type: 'json',
            n: options.n || 1,
        }
    }) as any

    return {
        code: response.code,
        data: {
            n: options.n || 1,
            title: response.title,
            singer: response.singer,
            id: response.track_id || options.n || 1,
            cover: response.cover,
            link: response.link,
            music_url: response.music,
            lyric: response.lrc,
            source: 'qishui'
        },
        source: 'qishui'
    };
}
