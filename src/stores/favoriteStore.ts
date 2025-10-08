// stores/favoriteStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UnifiedMusicItem } from '../api/music'
import type {DownloadedMusicItem} from "../types/electron";

export const useFavoriteStore = defineStore('favorite', () => {

    // 状态
    const favoriteSongs = ref<UnifiedMusicItem[]>([])
    const loading = ref(false)
    const refreshing = ref(false) // 新增刷新状态

    // 计算属性
    const favoriteCount = computed(() => favoriteSongs.value.length)

    // 生成唯一的歌曲键
    const getSongKey = (song: UnifiedMusicItem) => `${song.source}-${song.id}-${song.music_url}`

    // 刷新收藏列表 - 直接返回当前数据
    const refreshFavorites = async () => {
        refreshing.value = true
        try {
            console.log('刷新收藏列表，当前数量:', favoriteSongs.value.length)
            console.log(favoriteSongs.value)
            return favoriteSongs.value
        } finally {
            refreshing.value = false
        }
    }

    // 检查歌曲是否已收藏 - 基于 source 和 music_url
    const isFavorite = (song: UnifiedMusicItem | DownloadedMusicItem ) => {
        if (!song.music_url) return false
        const isDownloaded = 'localPath' in song || 'fileSize' in song
        // 如果是已下载的歌曲，则使用 localPath
        if(isDownloaded) return favoriteSongs.value.some(favSong =>
            favSong.source === song.source && (favSong.music_url === song.music_url || song.music_http_url === favSong.music_url)
        )
        // 如果是搜索结果，则使用 music_url
        return favoriteSongs.value.some(favSong =>
            favSong.source === song.source && (favSong.music_url === song.music_url)
        )
    }

    // 添加收藏
    const addFavorite = (song: UnifiedMusicItem) => {
        if (!song.music_url) {
            console.warn('歌曲没有 music_url，无法收藏:', song)
            return false
        }

        if (!isFavorite(song)) {
            favoriteSongs.value.push({ ...song }) // 创建副本避免引用问题
            return true
        }
        return false
    }

    // 移除收藏
    const removeFavorite = (song: UnifiedMusicItem) => {
        if (!song.music_url) return false

        const index = favoriteSongs.value.findIndex(favSong =>
            favSong.source === song.source && favSong.music_url === song.music_url
        )
        if (index !== -1) {
            favoriteSongs.value.splice(index, 1)
            return true
        }
        return false
    }

    // 切换收藏状态
    const toggleFavorite = (song: UnifiedMusicItem) => {
        if (!song.music_url) {
            console.warn('歌曲没有 music_url，无法操作收藏:', song)
            return false
        }
        if (isFavorite(song)) return removeFavorite(song)
        else return addFavorite(song)

    }

    // 批量添加收藏
    const addFavorites = (songs: UnifiedMusicItem[]) => {
        let addedCount = 0
        songs.forEach(song => {
            if (addFavorite(song)) addedCount++
        })
        return addedCount
    }

    // 清空所有收藏
    const clearAll = () => favoriteSongs.value = []

    // 根据ID查找收藏的歌曲
    const findFavoriteById = (source: string, id: string | number) => {
        return favoriteSongs.value.find(song =>
            song.source === source && song.id === id
        )
    }

    // 根据 source 和 music_url 查找收藏的歌曲
    const findFavorite = (source: string, musicUrl: string) => {
        return favoriteSongs.value.find(song =>
            song.source === source && song.music_url === musicUrl
        )
    }

    // 设置收藏列表（用于初始化或恢复）
    const setFavoriteSongs = (songs: UnifiedMusicItem[]) => favoriteSongs.value = songs

    return {
        // 状态
        favoriteSongs,
        loading,
        refreshing,

        // 计算属性
        favoriteCount,

        // 方法
        getSongKey,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        addFavorites,
        clearAll,
        findFavoriteById,
        findFavorite,
        setFavoriteSongs,
        refreshFavorites
    }
}, {
    persist: {
        key: 'favorite-store',
       paths: ['favoriteSongs']
    }
})