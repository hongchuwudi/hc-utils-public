<template>
  <!-- 歌曲详情弹窗 -->
  <Teleport to="body">
    <Transition name="detail-slide">
      <div
          v-if="showDetail"
          class="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-sm relative"
          @click.self="closeDetail"
          @wheel.stop.prevent="handleDetailWheel"
          v-bind="attrs"
      >
        <!-- 壁纸背景 - 放在最底层 -->
        <WallpaperBackground />


        <!-- 顶部导航栏 -->
        <div class="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30 px-4 py-3 shadow-sm z-[100]">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <ProButton
                  type="ghost"
                  size="sm"
                  :icon="ArrowLeft"
                  @click="closeDetail"
                  tooltip="返回"
                  tooltip-position="bottom"
              />
              <span class="text-lg font-medium truncate max-w-xs dark:text-gray-300">{{ currentSong?.title }}</span>
            </div>

            <div class="flex items-center gap-3">
              <!-- 是否显示封面-->
              <ProButton
                  type="secondary"
                  size="sm"
                  :icon="isShowCover ? Eye : EyeOff"
                  @click="isShowCover = !isShowCover"
                  :tooltip="isShowCover ? '隐藏封面' : '显示封面'"
                  tooltip-position="bottom"
              />
              <!-- 是否显示歌词-->
              <ProButton
                  type="secondary"
                  size="sm"
                  :icon="isShowLyrics ? Eye : EyeOff"
                  @click="isShowLyrics = !isShowLyrics"
                  :tooltip="isShowLyrics ? '隐藏歌词' : '显示歌词'"
                  tooltip-position="bottom"
              />
              <ProButton
                  v-if="props?.activeTab !=='downloaded' && currentSong && isValidHttpUrl(currentSong.music_url)"
                  type="secondary"
                  size="sm"
                  :icon="Download"
                  @click="downloadSong(currentSong!)"
                  tooltip="下载"
                  tooltip-position="bottom"
                  :loading="isBrChanging"
              />
              <ProButton
                  v-else
                  type="secondary"
                  size="sm"
                  :icon="FileDown"
                  @click="message.info(`该歌曲已经是本地文件了哦,位于${currentSong.music_url.replace('file://', '')}`)"
                  tooltip="下载"
                  tooltip-position="bottom"
                  :loading="isBrChanging"
              />
              <ProButton
                  v-if="currentSong?.link"
                  type="secondary"
                  size="sm"
                  :icon="Link"
                  @click="openSourceLink"
                  tooltip="查看歌曲来源"
                  tooltip-position="bottom"
              />
              <ProButton
                  type="secondary"
                  size="sm"
                  :icon="isShowWave === 1 ? AudioWaveform : (isShowWave === 2 ? AudioLines : (isShowWave === 3 ? Activity :LineSquiggle))"
                  @click="showWave"
                  :tooltip="isShowWave === 1 ? '波' : (isShowWave === 2 ? '心电' : (isShowWave === 3 ? '浪' : '音乐波'))"
                  tooltip-position="bottom"
                  class="mr-2"
              />
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="flex-1 flex flex-col md:flex-row items-center p-4 md:p-8 gap-6 md:gap-12 overflow-hidden -mt-20 relative" :class="isShowCover ? 'justify-center' : 'md:justify-center'">
          <!-- 动态背景波形线组件 -->
          <AudioWaveform1
              v-if="isShowWave === 1"
              :is-playing="isPlaying"
              :audio-element="globalAudioElement"
              :audio-url="currentSong?.music_url"
          />
          <AudioWaveform2
              v-else-if="isShowWave === 2"
              :is-playing="isPlaying"
              :audio-element="globalAudioElement"
              :audio-url="currentSong?.music_url"
          />
          <AudioWaveform3
              v-else-if="isShowWave === 3"
              :is-playing="isPlaying"
              :audio-element="globalAudioElement"
              :audio-url="currentSong?.music_url"
          />
          <!-- 左侧：歌曲封面和波纹效果 -->
          <div class="relative flex flex-col items-center gap-6 flex-1 max-w-md" v-if="!isMobileTerminal">
            <!-- 水波纹容器 -->
            <div v-if="isShowCover" class="relative">
              <!-- 波纹效果 -->
              <div
                  v-for="i in 3"
                  :key="i"
                  class="absolute inset-0 rounded-full border-2 border-blue-300/30 dark:border-blue-500/30"
                  :class="`ripple-${i}`"
                  :style="{
                  width: `${40 + i * 20}%`,
                  height: `${40 + i * 20}%`,
                  top: `${30 - i * 10}%`,
                  left: `${30 - i * 10}%`,
                  animationDelay: `${i * 0.5}s`
                }"
              ></div>
              <!-- 歌曲封面 -->
              <div  class="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
                <img
                    v-if="currentSong?.cover "
                    :src="currentSong.cover"
                    alt="Cover"
                    class="w-full h-full object-cover transition-transform duration-300"
                    :class="{ 'animate-spin': isPlaying }"
                    :style="{ animationDuration: '24s' }"
                />
                <img
                    v-else
                    src="https://pic2.zhimg.com/v2-2d44b34343fadb3f01872fa244580bc1_r.jpg"
                    alt="Cover"
                    class="w-full h-full object-cover transition-transform duration-300"
                    :class="{ 'animate-spin': isPlaying }"
                    :style="{ animationDuration: '24s' }"
                />
              </div>
            </div>

            <!-- 歌曲信息 -->
            <div v-if="isShowCover" class="text-center">
              <h2 class="text-2xl font-bold mb-2 dark:text-gray-300">{{ currentSong?.title }}</h2>
              <p class="text-gray-600 dark:text-gray-500">{{ currentSong?.singer }}</p>

              <!-- 音质切换加载状态提示 -->
              <div v-if="isBrChanging" class="mt-2 text-sm text-blue-500 flex items-center justify-center gap-1">
                <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                切换音质中...
              </div>
            </div>
          </div>

          <!-- 右侧：歌词区域 -->
          <div v-if="isShowLyrics" class="flex-1 max-w-md h-80 md:h-auto overflow-hidden flex flex-col" :class="{ 'w-full max-w-2xl': isMobileTerminal }">
            <!-- 移动端歌曲信息 -->
            <div v-if="isMobileTerminal" class="text-center mb-4 px-4">
              <h2 class="text-xl font-bold dark:text-gray-300 truncate">{{ currentSong?.title }}</h2>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ currentSong?.singer }}</p>
            </div>
            <div
                ref="lyricsContainer"
                class="flex-1 overflow-y-auto relative"
                @wheel="handleWheel"
                :class="{ 'min-h-0': isMobileTerminal }"
            >
              <div class="py-4" :class="{ 'px-4': isMobileTerminal }">
                <!-- 显示所有歌词，但非当前范围的歌词隐藏 -->
                <div
                    v-for="(line, index) in parsedLyrics"
                    :key="index"
                    ref="lyricLines"
                    class="py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer text-center lyric-item w-full max-w-md"
                    :class="[getLyricLineClass(index), { 'w-full': isMobileTerminal }]"
                    :style="getLyricProgressStyle(index)"
                    @click="seekToLyric(line.time)"
                >
                  {{ line.text }}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {ArrowLeft, Download, Link,AudioWaveform,AudioLines,LineSquiggle,Activity,FileDown,Eye,EyeOff} from 'lucide-vue-next'
import { ref, computed, watch, nextTick, onMounted, onUnmounted ,useAttrs} from 'vue'
import ProButton from '@/components/common/proButton.vue'
import { message } from 'ant-design-vue'
import { throttle } from 'lodash-es'
import { useWindowSize } from '@vueuse/core';
import AudioWaveform1 from "@/components/music/wave/AudioWaveform1.vue";
import AudioWaveform2 from "@/components/music/wave/AudioWaveform2.vue";
import AudioWaveform3 from "@/components/music/wave/AudioWaveform3.vue";
import { openExternalLink } from '../../utils/env.ts'
import WallpaperBackground from "@/components/donghua/WallpaperBackground.vue";
interface LyricLine {time: number,text: string}
const props = defineProps<{
  show: boolean
  currentSong: any
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playMode: string
  selectedBr: string
  brOptions: any[]
  isBrChanging?: boolean
  activeTab?: string
}>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'update:selectedBr', value: string): void
  (e: 'close'): void
  (e: 'toggle-play'): void
  (e: 'play-previous'): void
  (e: 'play-next'): void
  (e: 'change-play-mode'): void
  (e: 'toggle-mute'): void
  (e: 'set-volume', value: number): void
  (e: 'seek-audio', value: number): void
  (e: 'download-song', song: any): void
}>() // 定义 emit
const defaultLyric = [{ time: 0, text: '🎵 此歌曲为没有填词的纯音乐，请您欣赏' }] // 没有歌词时的默认提示
const showDetail = ref(false)
const lyricsContainer = ref<HTMLElement>()
const currentLyricIndex = ref(-1)
const lyricLines = ref<HTMLElement[]>([])
const manualScroll = ref(false)
const lyricProgress = ref(0)
const isShowWave = ref(0)
const { width } = useWindowSize();
const attrs = useAttrs()                      // 使用 useAttrs 来接收其他非props属性
let scrollTimeout: number | null = null       // 手动滚动定时器
let manualScrollTimeout: number | null = null // 手动滚动后的保护期

const isShowLyrics = ref<boolean>( true)   // 显示歌词
const isShowCover = ref<boolean>(true)     // 显示封面
const showWave = () => isShowWave.value = (isShowWave.value + 1) % 4
const isMobileTerminal = computed(() => width.value < 768 || !isShowCover.value)
const globalAudioElement = computed(() => document.querySelector('audio') as HTMLAudioElement)

// 解析歌词
const parsedLyrics = computed((): LyricLine[] => {
  try {
    const lyricText = props.currentSong?.lyric
    if (!lyricText || lyricText.trim() === '' || lyricText === '[00:00.00]此歌曲为没有填词的纯音乐，请您欣赏') return defaultLyric

    // 解码常见 HTML 实体
    const decodedLyrics = lyricText
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&#34;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x22;/g, '"')

    // 使用解码后的歌词继续处理
    const normalizedLyrics = decodedLyrics.replace(/\\n/g, '\n')  // 这里使用 decodedLyrics
    const lines = normalizedLyrics.split('\n')
    const result: LyricLine[] = []

    const timeRegex = /\[(\d{2}):(\d{2})(?:[.:](\d{2,3}))?]/g

    for (const line of lines) {
      const matches = [...line.matchAll(timeRegex)]

      if (matches.length === 0) continue

      for (const match of matches) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0

        const time = minutes * 60 + seconds + milliseconds / 1000
        const text = line.replace(timeRegex, '').trim()

        if (text && !text.match(/^\[(ti|ar|al|by|offset)/i)) {
          result.push({ time, text })
        }
      }
    }

    return result.length > 0 ? result.sort((a, b) => a.time - b.time) : defaultLyric
  } catch (error) {
    console.error('歌词解析失败:', error)
    return defaultLyric
  }
})

// 判断是否为有效的 HTTP/HTTPS 链接
const isValidHttpUrl = (url: string): boolean => {
  if (!url) return false
  return url.includes('http://') || url.includes('https://')
}

// 打开外部链接
const openSourceLink = async () => {
  if (props.currentSong?.link) {
    const success = await openExternalLink(props.currentSong.link)
    if (!success) {
      message.error('无法打开链接')
    }
  } else {
    message.info('该歌曲没有来源链接')
  }
}

// 添加进度样式函数
const getLyricProgressStyle = (index: number) => {
  const isPreview = manualScroll.value && index === currentLyricIndex.value
  const isActual = !manualScroll.value && index === currentLyricIndex.value

  if (isPreview || isActual) {
    const progressPercent = Math.round(lyricProgress.value * 100)
    const fromColor = isPreview ? '#f97316' : '#3b82f6' // 橙色或蓝色
    const toColor = '#9ca3af' // 灰色

    return {
      background: `linear-gradient(90deg, ${fromColor} 0%, ${fromColor} ${progressPercent}%, ${toColor} ${progressPercent}%, ${toColor} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }
  return {}
}

// 保留你喜欢的配色方案
const getLyricLineClass = (index: number) => {
  const isPreview = manualScroll.value && index === currentLyricIndex.value
  const isActual = !manualScroll.value && index === currentLyricIndex.value
  const isInRange = isInVisibleRange(index)
  if (!isInRange) return 'hidden'
  const distance = Math.abs(index - currentLyricIndex.value)
  const baseClasses = 'transition-all duration-300' // 基础样式
  // 根据距离当前歌词的远近设置不同样式
  if (isPreview) return `${baseClasses} text-2xl font-bold bg-gradient-to-r from-orange-500 to-gray-500 bg-clip-text text-transparent` // 预览状态：橙色渐变
  else if (isActual) return `${baseClasses} text-2xl font-bold bg-gradient-to-r from-blue-500 to-gray-500 bg-clip-text text-transparent` // 实际播放状态：蓝色渐变
  else if (distance === 1) return `${baseClasses} text-xl font-medium opacity-80 dark:opacity-70 text-gray-700 dark:text-gray-300` // 相邻歌词：稍大
  else if (distance === 2) return `${baseClasses} text-lg opacity-60 dark:opacity-50 text-gray-600 dark:text-gray-400` // 隔一行歌词：正常
  else return `${baseClasses} text-base opacity-40 dark:opacity-30 text-gray-500 dark:text-gray-500` // 其他歌词：较小
}

// 判断歌词是否在可见范围内
const isInVisibleRange = (index: number) => {
  if (currentLyricIndex.value < 0) return index < 10 // 初始显示更多

  const start = Math.max(0, currentLyricIndex.value - 4) // 显示前后各5句
  const end = Math.min(parsedLyrics.value.length - 1, currentLyricIndex.value + 4)

  return index >= start && index <= end
}

// 处理详情页内部的滚轮事件 - 预览切换歌词
const handleWheel = (event: WheelEvent) => {
  if (!lyricsContainer.value || parsedLyrics.value.length === 0) return

  event.preventDefault()
  event.stopPropagation()

  // 设置手动滚动标记，并延长保护时间
  manualScroll.value = true

  // 清除之前的超时
  if (scrollTimeout) clearTimeout(scrollTimeout)
  if (manualScrollTimeout) clearTimeout(manualScrollTimeout)

  const delta = event.deltaY
  const currentIndex = currentLyricIndex.value < 0 ? 0 : currentLyricIndex.value

  if (delta > 0) {
    // 向下滚动 - 切换到下一句歌词（仅预览）
    const nextIndex = Math.min(parsedLyrics.value.length - 1, currentIndex + 1)
    if (nextIndex !== currentIndex) {
      currentLyricIndex.value = nextIndex
      scrollToLyric(nextIndex)
      // 不移除：不跳转到时间点，仅预览
    }
  } else {
    // 向上滚动 - 切换到上一句歌词（仅预览）
    const prevIndex = Math.max(0, currentIndex - 1)
    if (prevIndex !== currentIndex) {
      currentLyricIndex.value = prevIndex
      scrollToLyric(prevIndex)
      // 不移除：不跳转到时间点，仅预览
    }
  }

  // 设置较长的保护期，在此期间禁止自动滚动
  manualScrollTimeout = setTimeout(() => {
    manualScroll.value = false
    // 保护期结束后，恢复到实际播放的歌词位置
    updateCurrentLyric(props.currentTime)
  }, 3000)

  // 设置滚动超时
  scrollTimeout = setTimeout(() => {
  }, 3000)
}

// 平滑滚动到指定歌词（仅用于预览）
const scrollToLyric = (index: number) => {
  if (!lyricsContainer.value) return

  nextTick(() => {
    const lyricElements = lyricLines.value
    if (lyricElements[index]) {
      const container = lyricsContainer.value!
      const element = lyricElements[index]

      // 获取容器的实际可视高度
      const containerRect = container.getBoundingClientRect()
      const containerHeight = containerRect.height

      // 获取元素相对于容器的位置
      const elementRect = element.getBoundingClientRect()
      const containerRectTop = container.getBoundingClientRect().top
      const elementOffsetTop = elementRect.top - containerRectTop + container.scrollTop

      // 计算目标滚动位置：元素顶部到容器中间
      const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (element.offsetHeight / 2)

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  })
}

// 处理详情页整体的滚轮事件，阻止冒泡
const handleDetailWheel = (event: WheelEvent) => {
  event.stopPropagation()
  event.preventDefault()
}

// 更新当前歌词,在手动滚动时跳过自动滚动
const updateCurrentLyric = (time: number) => {
  // 如果是手动滚动模式，跳过自动更新
  if (manualScroll.value) {
    return
  }

  if (parsedLyrics.value.length === 0) {
    currentLyricIndex.value = -1
    lyricProgress.value = 0
    return
  }

  let left = 0
  let right = parsedLyrics.value.length - 1
  let newIndex = -1

  // 二分查找
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const lyric = parsedLyrics.value[mid]

    if (!lyric) break

    const lyricTime = lyric.time

    if (time >= lyricTime) {
      newIndex = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  // 更新当前歌词索引
  if (currentLyricIndex.value !== newIndex) {
    currentLyricIndex.value = newIndex
    if (newIndex >= 0 && !manualScroll.value) {
      scrollToCurrentLyric()
    }
  }

  // 更新渐变进度
  if (newIndex >= 0) {
    const currentLyric = parsedLyrics.value[newIndex]
    const nextLyric = parsedLyrics.value[newIndex + 1]

    if (!currentLyric) {
      lyricProgress.value = 0
      return
    }

    if (nextLyric) {
      const segmentDuration = nextLyric.time - currentLyric.time
      if (segmentDuration > 0) {
        const progressInSegment = time - currentLyric.time
        lyricProgress.value = Math.max(0, Math.min(1, progressInSegment / segmentDuration))
      } else {
        lyricProgress.value = 1
      }
    } else {
      const remainingTime = props.duration - currentLyric.time
      if (remainingTime > 0) {
        lyricProgress.value = Math.max(0, Math.min(1, (time - currentLyric.time) / remainingTime))
      } else {
        lyricProgress.value = 1
      }
    }
  } else {
    lyricProgress.value = 0
  }
}

// 平滑滚动到当前歌词
const scrollToCurrentLyric = async () => {
  if (!lyricsContainer.value || currentLyricIndex.value < 0 || manualScroll.value) return

  await nextTick()

  const container = lyricsContainer.value
  const currentLineElement = lyricLines.value[currentLyricIndex.value]

  if (currentLineElement) {
    // 获取容器的实际可视高度（排除padding）
    const containerRect = container.getBoundingClientRect()
    const containerHeight = containerRect.height

    // 获取元素相对于容器的位置
    const elementRect = currentLineElement.getBoundingClientRect()
    const containerRectTop = container.getBoundingClientRect().top
    const elementOffsetTop = elementRect.top - containerRectTop + container.scrollTop

    // 计算目标滚动位置：元素顶部到容器中间
    const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (currentLineElement.offsetHeight / 2)

    // 只有当距离较大时才滚动（减少不必要的微调）
    const scrollThreshold = containerHeight * 0.2
    if (Math.abs(container.scrollTop - targetScrollTop) > scrollThreshold) {
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  }
}

// 监听当前播放时间
const throttledUpdate = throttle((time: number) => {
  updateCurrentLyric(time + 0.45 )
}, 16) // FPS:60

// 在详情页显示时禁用背景滚动
watch(() => props.show, (newVal) => {
  showDetail.value = newVal
  if (newVal) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})
// 修改监听器
watch(() => props.currentTime, (newTime) => throttledUpdate(newTime))
// 监听歌词数据变化
watch(parsedLyrics, () => {
  nextTick(() => {
    if (lyricLines.value.length > 0 && currentLyricIndex.value >= 0 && !manualScroll.value) {
      scrollToCurrentLyric()
    }
  })
})
// 监听详情页显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      setTimeout(() => {
        manualScroll.value = false
        scrollToCurrentLyric()
      }, 100)
    })
  }
})

// 事件处理函数
const seekToLyric = (time: number) => {
  // 立即清除预览状态，恢复到实际播放
  manualScroll.value = false
  if (manualScrollTimeout) {
    clearTimeout(manualScrollTimeout)
    manualScrollTimeout = null
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }

  // 执行跳转
  emit('seek-audio', time)
}
const downloadSong = (song: any) => emit('download-song', song)
const closeDetail = () => {
  showDetail.value = false
  setTimeout(() => {
    emit('update:show', false)
    emit('close')
  }, 300)
}

// 生命周期
onMounted(() => {
  const resizeObserver = new ResizeObserver(() => (currentLyricIndex.value >= 0 && !manualScroll.value) ? scrollToCurrentLyric() : 1)
  if (lyricsContainer.value) resizeObserver.observe(lyricsContainer.value)
})
onUnmounted(() => document.body.style.overflow = '')

</script>

<style scoped>
/* 当前歌词进度渐变效果 */
.current-lyric-preview {
  background: linear-gradient(90deg, #f97316 0%, #f97316 var(--progress, 0%), #6b7280 var(--progress, 0%), #6b7280 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.current-lyric-actual {
  background: linear-gradient(90deg, #3b82f6 0%, #3b82f6 var(--progress, 0%), #6b7280 var(--progress, 0%), #6b7280 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 暗色主题适配 */
.dark .current-lyric-preview {
  background: linear-gradient(90deg, #f97316 0%, #f97316 var(--progress, 0%), #9ca3af var(--progress, 0%), #9ca3af 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark .current-lyric-actual {
  background: linear-gradient(90deg, #3b82f6 0%, #3b82f6 var(--progress, 0%), #9ca3af var(--progress, 0%), #9ca3af 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
/* 弹窗动画 */
.detail-slide-enter-active,
.detail-slide-leave-active {
  transition: all 0.3s ease;
}

.detail-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.detail-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 封面旋转动画 */
.animate-spin {
  animation: spin 10s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 水波纹动画 */
.ripple-1,
.ripple-2,
.ripple-3 {
  animation: ripple 3s infinite ease-in-out;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* 自定义滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.7);
}

/* 完全隐藏滚动条但保留滚动功能 */
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* 歌词行过渡动画 */
.lyric-line {
  transition: all 0.3s ease-in-out;
}

/* 确保歌词容器有正确的滚动行为 */
.lyrics-container {
  display: flex;
  flex-direction: column;
}
.lyric-item {
   text-align: center;
   width: 100%;
   max-width: 28rem; /* 限制最大宽度，确保居中 */
   margin: 0 auto; /* 水平居中 */
   line-height: 1.6;
   transition: all 0.3s ease-in-out;
 }
/* 确保所有歌词在一条竖线上对齐 */
.lyric-item {
  box-sizing: border-box;
}
/* 平滑的字体大小过渡 */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .lyric-item {
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }

  .text-xl {
    font-size: 1.125rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .text-base {
    font-size: 0.875rem;
  }
}
/* 添加触摸设备友好的滚动 */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

.fixed {
  position: fixed;
}
/* 确保详情页内容可以滚动 */
.flex-1.overflow-hidden {
  overflow: hidden;
}

.current-lyric-progress {
  background: linear-gradient(90deg, #3b82f6 0%, #3b82f6 var(--progress, 0%), #6b7280 var(--progress, 0%), #6b7280 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
}

/* 动态更新 --progress 变量 */
:deep(.current-lyric-progress) {
  --progress: calc(var(--lyric-progress, 0) * 100%);
}
</style>