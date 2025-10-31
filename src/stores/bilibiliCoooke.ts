// stores/bilibiliCoooke.ts
import { defineStore }      from 'pinia'
import { ref }              from 'vue'
import {type BiliCookie }   from '../types/video/bilibili.ts'

export const useBilibiliStore = defineStore('bilibili', () => {
    // 用户登录信息
    const userInfo = ref<{
        userId: string
        cookies: BiliCookie
        loginTime: number
    } | null>(null)

    // 设置用户信息
    const setUserInfo = (userId: string, cookies: BiliCookie) => userInfo.value = {userId, cookies, loginTime: Date.now()}
    // 清除用户信息
    const clearUserInfo = () => userInfo.value = null
    // 检查是否已登录
    const isLoggedIn = () => !!userInfo.value?.userId

    return {
        userInfo,
        setUserInfo,
        clearUserInfo,
        isLoggedIn
    }
}, {
    persist: {
        key: 'bilibili-storage',
        paths: ['userInfo']
    }
})