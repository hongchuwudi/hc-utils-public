import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type UnifiedMusicItem } from '../types/music/music.ts'
import { getMusicDetail } from '../api/music/music.ts'

export const usePlayerStore = defineStore('player', () => {
    // 播放状态
    const currentSong = ref<UnifiedMusicItem | null>(null)         // 当前播放歌曲
    const isPlaying = ref(false)                                         // 播放状态
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.7)
    const isMuted = ref(false)
    const playMode = ref<'sequence' | 'single' | 'random'>('sequence')
    const selectedBr = ref<string>('')
    const searchKeyword = ref<string>('')
    const playbackRate = ref(1.0) // 播放倍速
    // 播放列表相关
    const playList = ref<UnifiedMusicItem[]>([])
    const currentSongIndex = ref(-1)
    const isBrChanging = ref(false)
    const currentApi = ref<'qq' | 'wyy' | 'kw' | 'qishui'>('qq')
    const currentListMode = ref<'search' | 'downloaded' | 'favorite'>('search')

    // 是否显示底部播放栏
    const showBottomPlayer = ref<boolean>(true)

    // 音频元素引用
    let audioElement: HTMLAudioElement | null = null

    // 音质配置
    const brOptionsConfig = {
        qq: [
            { value: '2', label: '高清品质' },
            { value: '1', label: '无损品质' }
        ],
        wyy: [
            { value: '1', label: '标准品质' },
            { value: '2', label: '极高品质' },
            { value: '3', label: '无损品质' },
            { value: '4', label: 'Hi-Res品质' },
            { value: '5', label: '高清环绕声' },
            { value: '6', label: '沉浸环绕声' },
            { value: '7', label: '超清母带' }
        ],
        kw: [
            { value: '128', label: '标准品质' },
            { value: '320', label: '高清品质' },
            { value: 'flac', label: '无损品质' }
        ],
        qishui: [
            { value: 'default', label: '默认品质' }
        ]
    }
    const defaultBrConfig = {
        qq: '1',
        wyy: '1',
        kw: 'flac',
        qishui: 'default'
    }
    const apiOptions = [
        { value: 'qq', label: 'QQ音乐' },
        { value: 'wyy', label: '网易云音乐' },
        { value: 'kw', label: '酷我音乐' },
        { value: 'qishui', label: '汽水音乐' }
    ]

    // 计算属性
    const progress = computed(() => duration.value === 0 ? 0 : currentTime.value / duration.value)
    const playModeText = computed(() => {
        switch (playMode.value) {
            case 'single': return '单曲循环'
            case 'random': return '随机播放'
            default: return '顺序播放'
        }
    })
    // 播放列表模式
    const playListModelText = computed(() => {
        switch (currentListMode.value) {
            case 'search': return '搜索列表'
            case 'downloaded': return '下载目录'
            case 'favorite': return '收藏目录'
            default: return '未知列表'
        }
    })

    const hasCurrentSong = computed(() => currentSong.value !== null)
    const brOptions = computed(() => {
        if (!currentSong.value) return []
        const source = currentSong.value.source as keyof typeof brOptionsConfig
        return brOptionsConfig[source] || []
    })
    const isShowBottomPlayer = computed(() => showBottomPlayer.value)

    // 是否显示底部播放器
    const toggleBottomPlayer = () => showBottomPlayer.value = !showBottomPlayer.value

    // 设置当前列表模式
    const setCurrentListMode = (mode: 'search' | 'downloaded' | 'favorite') => currentListMode.value = mode
    const setSearchKeyword = (keyword: string) => searchKeyword.value = keyword

    // 设置播放倍速
    const setPlaybackRate = (rate: number) => {
        playbackRate.value = Math.max(0.1, Math.min(3.0, rate)) // 限制在 0.1-3.0 之间
        if (audioElement) {
            audioElement.playbackRate = playbackRate.value
        }
    }

    // 通过滑块设置倍速 (0-290 对应 0.1-3.0)
    const setPlaybackRateFromSlider = (sliderValue: number) => {
        const rate = (sliderValue / 100) + 0.1
        setPlaybackRate(rate)
    }

    // 核心音频操作方法
    const loadAndPlayAudio = async (musicUrl: string) => {
        if (!audioElement) throw new Error('音频元素未初始化')

        // 先暂停等待加载url
        audioElement.pause()
        audioElement.src = musicUrl
        audioElement.playbackRate = playbackRate.value // 设置倍速
        audioElement.load()
        await audioElement.play()

        isPlaying.value = true
        console.log('开始播放:', currentListMode.value)
    }

    // 获取完整歌曲信息（包含music_url）
    const getFullSongInfo = async (song: UnifiedMusicItem, searchKey?: string) => {
        const options: { br?: string, n?: number } = { n: song.n }
        if (currentApi.value !== 'qishui') options.br = selectedBr.value

        // 如果有 searchKey 就使用 searchKey，否则使用 song.title
        const searchTitle = searchKey || song.title

        const result = await getMusicDetail(searchTitle, currentApi.value, options)
        if (result.code === 200 && result.data.music_url) return result.data
        throw new Error('获取歌曲详情失败')
    }

    // 初始化音频元素
    const initAudioElement = (element: HTMLAudioElement) => {
        audioElement = element
        audioElement.volume = volume.value
    }

    // 音频事件处理
    const handleTimeUpdate = () =>audioElement ? currentTime.value = audioElement.currentTime : 1
    const handleLoadedMetadata = () => audioElement ? duration.value = audioElement.duration : 1

    // 播放结束处理
    const handleSongEnd = () => {
        if (playMode.value === 'single') {
            if (audioElement) {
                audioElement.currentTime = 0
                audioElement.play().catch(console.error)
            }
        } else playNext().then(r => r)
    }

    // 处理音频错误
    const handleAudioError = (error: Event) => {
        console.error('音频播放错误:', error)
        isPlaying.value = false
    }

    // 播放控制方法
    const playSong = async (song: UnifiedMusicItem, playListItems?: UnifiedMusicItem[], api?: 'qq' | 'wyy' | 'kw' | 'qishui',listMode?: 'search' | 'downloaded' | 'favorite') => {
        if (api) currentApi.value = api
        if (playListItems) playList.value = playListItems
        if (listMode) setCurrentListMode(listMode)

        currentSongIndex.value = playList.value.findIndex(s => {
            // 1. music_url 匹配（所有模式通用）
            if (s.music_url && song.music_url && s.music_url === song.music_url) {
                console.log('✅ music_url匹配:', s.title)
                return true
            }

            // 2. 只在search模式下使用 id + source 匹配
            if (currentListMode.value === 'search')
                if ((String(s.id) === String(song.id) || (String(s.n) === String(song.n))) && s.source === song.source) {
                    console.log('✅ id+source匹配:', s.title)
                    return true
                }
            // 3. 最后使用 title + singer 作为兜底匹配（所有模式通用）
            console.log('❌ 未匹配:', s.title)
            return false
        })

        currentSong.value = song
        currentTime.value = 0
        isPlaying.value = true

        if (song.music_url) await loadAndPlayAudio(song.music_url)
    }

    // 播放控制
    const togglePlay = async () => {
        if (!audioElement) return

        if (isPlaying.value) {
            audioElement.pause()
            isPlaying.value = false
        } else {
            if (currentSong.value?.music_url) {
                await audioElement.play()
                isPlaying.value = true
            } else if (playList.value.length > 0) {
                const firstSong = playList.value[0]
                if (firstSong) await playSong(firstSong)
            }
        }
    }

    // 获取下一首歌曲索引
    const getNextSongIndex = () => {
        if (playMode.value === 'random') return Math.floor(Math.random() * playList.value.length)
        else return currentSongIndex.value < playList.value.length - 1 ? currentSongIndex.value + 1 : 0
    }
    // 播放下一首
    const playNext = async () => {
        if (!playList.value.length || currentSongIndex.value === -1) return

        const nextIndex = getNextSongIndex()
        const nextSong = playList.value[nextIndex]

        if (nextSong && currentListMode.value === 'search') {
            const fullSong = await getFullSongInfo(nextSong,searchKeyword.value)
            await playSong(fullSong, playList.value)
        } else {
            if(nextSong) await playSong(nextSong, playList.value)
        }
    }
    // 获取上一首歌曲索引
    const getPreviousSongIndex = () => {
        if (playMode.value === 'random') return Math.floor(Math.random() * playList.value.length)
        else return currentSongIndex.value > 0 ? currentSongIndex.value - 1 : playList.value.length - 1
    }
    // 播放上一首
    const playPrevious = async () => {
        if (!playList.value.length || currentSongIndex.value === -1) return

        const prevIndex = getPreviousSongIndex()
        const prevSong = playList.value[prevIndex]

        if (prevSong && currentListMode.value === 'search') {
            const fullSong = await getFullSongInfo(prevSong,searchKeyword.value)
            await playSong(fullSong, playList.value)
        } else {
            if(prevSong) await playSong(prevSong, playList.value)
        }
    }

    // 播放模式控制
    const changePlayMode = () => {
        const modes = ['sequence', 'single', 'random'] as const
        const currentIndex = modes.indexOf(playMode.value)
        const nextMode = modes[(currentIndex + 1) % modes.length]

        if (nextMode) playMode.value = nextMode
        else playMode.value = 'sequence' // 回退到默认模式
    }

    // 进度控制
    const seekAudio = (newTime: number) => {
        if (audioElement) {
            audioElement.currentTime = newTime
            currentTime.value = newTime
        }
    }

    // 音量控制
    const setVolume = (newVolume: number) => {
        volume.value = Math.max(0, Math.min(1, newVolume))
        if (audioElement) audioElement.volume = volume.value
        if (volume.value > 0 && isMuted.value) isMuted.value = false
    }

    // 静音控制
    const toggleMute = () => {
        isMuted.value = !isMuted.value
        if (audioElement) audioElement.volume = isMuted.value ? 0 : volume.value
    }

    // 通过进度条设置音量（0-100）
    const setVolumeFromProgress = (progressValue: number) => setVolume(progressValue / 100)

    // 音质控制
    const setSelectedBr = async (searchKeyWord:string) => {
        if (!currentSong.value) return

        const fullSong = await getFullSongInfo(currentSong.value,searchKeyWord)
        currentSong.value = fullSong
        console.log(currentSong.value)
        // 重新播放
        if (audioElement) {
            audioElement.src = String(fullSong.music_url)
            audioElement.load()
            await audioElement.play()
        }
    }

    // API设置
    const setCurrentApi = (api: 'qq' | 'wyy' | 'kw' | 'qishui') => {
        currentApi.value = api
        selectedBr.value = defaultBrConfig[api]
    }

    // 重置播放器
    const resetPlayer = () => {
        if (audioElement) {
            audioElement.pause()
            audioElement.currentTime = 0
        }
        currentSong.value = null
        isPlaying.value = false
        currentTime.value = 0
        duration.value = 0
        playList.value = []
        currentSongIndex.value = -1
    }

    return {
        // 常量
        brOptionsConfig,
        defaultBrConfig,
        apiOptions,

        // 状态
        playbackRate,
        currentSong,
        searchKeyword,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playMode,
        selectedBr,
        playList,
        currentSongIndex,
        isBrChanging,
        currentListMode,
        showBottomPlayer,

        // 计算属性
        progress,
        playModeText,
        hasCurrentSong,
        brOptions,
        playListModelText,
        isShowBottomPlayer,

        // 方法
        toggleBottomPlayer,
        setPlaybackRate,
        setPlaybackRateFromSlider,
        initAudioElement,
        playSong,
        togglePlay,
        playPrevious,
        playNext,
        changePlayMode,
        seekAudio,
        setVolume,
        toggleMute,
        setVolumeFromProgress,
        setSelectedBr,
        setCurrentApi,
        resetPlayer,
        setCurrentListMode,
        setSearchKeyword,

        // 事件处理
        handleTimeUpdate,
        handleLoadedMetadata,
        handleSongEnd,
        handleAudioError
    }
})