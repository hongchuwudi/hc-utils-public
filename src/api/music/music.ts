import request from '../../utils/request.ts'
import type { UnifiedDetailResponse,UnifiedSearchResponse,UnifiedMusicItem } from '../../types/music/music.ts'

// 统一搜索API 和 统一详情API - 改为调用后端
export const searchMusic = async (songName: string, source: 'qq' | 'wyy' | 'kw' | 'qishui' = 'qq'): Promise<UnifiedSearchResponse> => {
    const response = await request.get('/api/proxy/music/search', {
        params: {
            songName,
            source
        }
    });
    response.data.data.forEach((item: UnifiedMusicItem) => item.id = item.n);
    return response.data;
}
export const getMusicDetail = async (songName: string, source: 'qq' | 'wyy' | 'kw' | 'qishui' = 'qq', options: { br?: string, n?: number } = {}): Promise<UnifiedDetailResponse> => {
    const response = await request.get('/api/proxy/music/detail', {
        params: {
            songName,
            source,
            br: options.br,
            n: options.n
        }
    });
    response.data.data.n =  options.n || 1;
    response.data.data.id = options.n || 1;
    return response.data;
}