
// 用户信息类型
export interface UserInfo {
  id?: string
  name?: string
  avatar?: string
  qq?: number | string
  // 可以后续扩展
}

// 搜索历史项
export interface SearchHistoryItem {
  keyword: string
  timestamp: number
  type: 'music' | 'video'
}