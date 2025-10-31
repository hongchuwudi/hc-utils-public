import request from '../../utils/request.ts'
import { useBilibiliStore } from  '../../stores/bilibiliCoooke.ts'
import type {
    QrcodeImage,
    BiliCookie,
    ApiResult,
    BilibiliVideoInfo,
    BilibiliPlayUrlInfo,
    PlayUrlRequest
} from '../../types/video/bilibili.ts';

const UserInfo = useBilibiliStore().userInfo

// 获取二维码图片
export const getQrcodeImage = async (): Promise<QrcodeImage> => {
    const response = await request.get('/api/proxy/bilibili/passport/login/only')
    console.log('获取二维码图片:',response.data)
    return response.data
}

// 轮询登录状态
export const pollLoginStatus = async (qrcodeKey: string): Promise<any> => {
    const response = await request.get('/api/proxy/bilibili/passport/login/status', {
        params: { qrcode_key: qrcodeKey }
    })
    console.log('轮询登录状态:',response.data)
    return response.data
}

// 解析cookies
export const parseCookies = (loginData: any): BiliCookie => {
    const urlParams = new URLSearchParams(loginData.url.split('?')[1])
    return {
        dedeUserID: urlParams.get('DedeUserID') || '',
        sessdata: urlParams.get('SESSDATA') || '',
        bili_jct: urlParams.get('bili_jct') || '',
        refresh_token: loginData.refresh_token
    }
}

// 获取视频信息
export const getVideoInfo = (bvid: string): Promise<ApiResult<BilibiliVideoInfo>> => request.get(`/api/proxy/bilibili/video/${bvid}`)

// 获取视频流地址
export const getPlayUrl = (params: PlayUrlRequest): Promise<ApiResult<BilibiliPlayUrlInfo>> => {
    const headers = UserInfo.cookies ? { SESSDATA: UserInfo.cookies } : {}
    return request.get('/api/proxy/bilibili/playurl', { params, headers })
}