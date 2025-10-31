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
    source: 'qq' | 'wyy' | 'kw' | 'qishui';
    lyric_url?: string
    [key: string]: any
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