import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, SearchHistoryItem } from '../types'

export const useAppStore = defineStore('app', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)

  // 存储位置
  const musicStoragePath = ref<string>('')
  const videoStoragePath = ref<string>('')

  // 搜索历史
  const musicSearchHistory = ref<SearchHistoryItem[]>([])
  const videoSearchHistory = ref<SearchHistoryItem[]>([])

  // 用户信息相关方法
  const setUserInfo = (info: UserInfo) => userInfo.value = info
  const clearUserInfo = () => userInfo.value = null

  // 存储路径相关方法
  const setMusicStoragePath = (path: string) => musicStoragePath.value = path
  const setVideoStoragePath = (path: string) => videoStoragePath.value = path

  // 搜索历史相关方法
  const addMusicSearchHistory = (keyword: string) => {
    const existingIndex = musicSearchHistory.value.findIndex(
        item => item.keyword === keyword
    )
    // 如果已存在，移到最前面
    if (existingIndex !== -1) musicSearchHistory.value.splice(existingIndex, 1)

    musicSearchHistory.value.unshift({
      keyword,
      timestamp: Date.now(),
      type: 'music'
    })

    // 只保留最近10条
    if (musicSearchHistory.value.length > 10) musicSearchHistory.value = musicSearchHistory.value.slice(0, 10)
  }
  const addVideoSearchHistory = (keyword: string) => {
    const existingIndex = videoSearchHistory.value.findIndex(
        item => item.keyword === keyword
    )

    if (existingIndex !== -1) videoSearchHistory.value.splice(existingIndex, 1)

    videoSearchHistory.value.unshift({
      keyword,
      timestamp: Date.now(),
      type: 'video'
    })

    // 只保留最近10条
    if (videoSearchHistory.value.length > 10) videoSearchHistory.value = videoSearchHistory.value.slice(0, 10)
  }
  const clearMusicSearchHistory = () => musicSearchHistory.value = []
  const clearVideoSearchHistory = () => videoSearchHistory.value = []

  return {
    // 状态
    userInfo,
    musicStoragePath,
    videoStoragePath,

    musicSearchHistory,
    videoSearchHistory,

    // 方法
    setUserInfo,
    clearUserInfo,
    setMusicStoragePath,
    setVideoStoragePath,
    addMusicSearchHistory,
    addVideoSearchHistory,
    clearMusicSearchHistory,
    clearVideoSearchHistory
  }
}, {
  // 持久化配置（如果需要）
  persist: {
    key: 'app-storage',
    paths: [
      'userInfo',
      'musicStoragePath',
      'videoStoragePath',
      'musicSearchHistory',
      'videoSearchHistory'
    ]
  }
})