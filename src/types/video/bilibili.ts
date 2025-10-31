// 二维码信息
export interface QrcodeImage {
    qrcode_key: string;
    base_url: string;
}

// 登录成功后的Cookie信息
export interface BiliCookie {
    dedeUserID: string;
    sessdata: string;
    bili_jct: string;
    refresh_token: string;
}

// 视频信息-完整版
export interface BilibiliVideoInfo {
    code: number;
    message: string;
    ttl: number;
    data: {
        bvid: string;
        aid: number;
        videos: number;
        tid: number;
        tname: string;
        copyright: number;
        pic: string;
        title: string;
        pubdate: number;
        ctime: number;
        desc: string;
        desc_v2: Array<{
            raw_text: string;
            type: number;
            biz_id: number;
        }>;
        state: number;
        duration: number;
        rights: {
            bp: number;
            elec: number;
            download: number;
            movie: number;
            pay: number;
            hd5: number;
            no_reprint: number;
            autoplay: number;
            ugc_pay: number;
            is_cooperation: number;
            ugc_pay_preview: number;
            no_background: number;
            clean_mode: number;
            is_stein_gate: number;
            is_360: number;
            no_share: number;
            arc_pay: number;
            free_watch: number;
        };
        owner: {
            mid: number;
            name: string;
            face: string;
        };
        stat: {
            aid: number;
            view: number;
            danmaku: number;
            reply: number;
            favorite: number;
            coin: number;
            share: number;
            like: number;
            dislike: number;
            now_rank: number;
            his_rank: number;
            evaluation: string;
            vt: number;
        };
        dynamic: string;
        cid: number;
        dimension: {
            width: number;
            height: number;
            rotate: number;
        };
        premiere: any;
        teenage_mode: number;
        is_chargeable_season: boolean;
        is_story: boolean;
        is_upower_exclusive: boolean;
        is_upower_play: boolean;
        is_upower_preview: boolean;
        enable_vt: number;
        vt_display: string;
        no_cache: boolean;
        pages: Array<{
            cid: number;
            page: number;
            from: string;
            part: string;
            duration: number;
            vid: string;
            weblink: string;
            dimension: {
                width: number;
                height: number;
                rotate: number;
            };
            first_frame: string;
        }>;
        subtitle: {
            allow_submit: boolean;
            list: Array<{
                id: number;
                lan: string;
                lan_doc: string;
                is_lock: boolean;
                subtitle_url: string;
                type: number;
                id_str: string;
            }>;
        };
        label: {
            path: string;
            text: string;
            label_theme: string;
            text_color: string;
            bg_style: number;
            bg_color: string;
            border_color: string;
            use_img_label: boolean;
            img_label_uri_hans: string;
            img_label_uri_hant: string;
            img_label_uri_hans_static: string;
            img_label_uri_hant_static: string;
        };
        user_garb: {
            url_image_ani_cut: string;
        };
        honor_reply: {
            honor: Array<{
                aid: number;
                type: number;
                desc: string;
                weekly_recommend_num: number;
            }>;
        };
        like_icon: string;
        need_jump_bv: boolean;
    };
}

// 播放地址信息
export interface BilibiliPlayUrlInfo {
    code: number;
    message: string;
    ttl: number;
    data: {
        from: string;
        result: string;
        message: string;
        quality: number;
        format: string;
        timelength: number;
        accept_format: string;
        accept_description: string[];
        accept_quality: number[];
        video_codecid: number;
        seek_param: string;
        seek_type: string;
        durl: Array<{
            order: number;
            length: number;
            size: number;
            ahead: string;
            vhead: string;
            url: string;
            backup_url: string[];
        }>;
        dash: {
            duration: number;
            minBufferTime: number;
            min_buffer_time: number;
            video: Array<{
                id: number;
                baseUrl: string;
                base_url: string;
                backupUrl: string[];
                backup_url: string[];
                bandwidth: number;
                mimeType: string;
                mime_type: string;
                codecs: string;
                width: number;
                height: number;
                frameRate: string;
                frame_rate: string;
                sar: string;
                startWithSap: number;
                start_with_sap: number;
                SegmentBase: {
                    Initialization: string;
                    indexRange: string;
                };
                codecid: number;
            }>;
            audio: Array<{
                id: number;
                baseUrl: string;
                base_url: string;
                backupUrl: string[];
                backup_url: string[];
                bandwidth: number;
                mimeType: string;
                mime_type: string;
                codecs: string;
            }>;
            dolby: {
                type: number;
                audio: Array<{
                    id: number;
                    baseUrl: string;
                    base_url: string;
                    backupUrl: string[];
                    backup_url: string[];
                    bandwidth: number;
                    mimeType: string;
                    mime_type: string;
                    codecs: string;
                }>;
            };
            flac: {
                display: boolean;
                audio: {
                    id: number;
                    baseUrl: string;
                    base_url: string;
                    backupUrl: string[];
                    backup_url: string[];
                    bandwidth: number;
                    mimeType: string;
                    mime_type: string;
                    codecs: string;
                };
            };
        };
        support_formats: Array<{
            quality: number;
            format: string;
            new_description: string;
            display_desc: string;
            superscript: string;
            codecs: string[];
        }>;
        high_format: any;
        last_play_time: number;
        last_play_cid: number;
    };
}

// 播放地址请求参数
export interface PlayUrlRequest {
    bvid: string;
    avid?: number;
    cid: number;
    qn?: number;
    fnval?: number;
    fourk?: number;
}

// API响应基础类型
export interface ApiResult<T = any> {
    code: number;
    message: string;
    data: T;
    success: boolean;
}