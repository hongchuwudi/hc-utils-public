// stores/videoPlayer.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoPlayerStore = defineStore('videoPlayer', () => {
    // 状态
    const isPlaying = ref<boolean>(false)
    const isFullscreen = ref<boolean>(false)
    const volume = ref<number>(1)

    // 播放控制
    const play = () => isPlaying.value = true
    const pause = () => isPlaying.value = false
    const togglePlay = () => isPlaying.value = !isPlaying.value
    // 全屏控制
    const enterFullscreen = () => isFullscreen.value = true
    const exitFullscreen = () => isFullscreen.value = false
    const toggleFullscreen = () => isFullscreen.value = !isFullscreen.value
    // 音量控制
    const setVolume = (value: number) => volume.value = Math.max(0, Math.min(1, value))

    return {
        // 状态
        isPlaying,
        isFullscreen,
        volume,

        // 方法
        play,
        pause,
        togglePlay,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
        setVolume
    }
})