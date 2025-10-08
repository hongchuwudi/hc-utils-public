<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Hero 区域 -->
    <section class="relative py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Zero 区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <!-- 左上区域 - 重新设计 -->
          <div
              class="relative bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-900/10 dark:via-gray-900 dark:to-blue-900/10 rounded-2xl p-8 lg:p-10 shadow-lg fade-in overflow-hidden"
              :class="{ 'visible': isVisible }"
          >
            <!-- 背景装饰元素 -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-pink-200 dark:bg-pink-800/20 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 dark:bg-blue-800/20 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>

            <div class="relative z-10">
              <!-- 主标题区域 -->
              <div class="mb-8">
                <h1 class="text-5xl lg:text-6xl font-bold mb-4">
                  <span class="text-gray-900 dark:text-white">HC</span>
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">Utils</span>
                </h1>
                <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  重新定义您的<span class="font-semibold text-pink-500 dark:text-pink-400">数字生活体验</span>，一站式解决所有需求
                </p>
              </div>

              <!-- 特性标签 -->
              <div class="flex flex-wrap gap-3 mb-8">
                <span class="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-full text-sm font-medium flex items-center gap-2">
                  <i class="fas fa-bolt text-pink-500"></i>
                  极速启动
                </span>
                <span class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center gap-2">
                  <i class="fas fa-shield-alt text-blue-500"></i>
                  安全可靠
                </span>
                <span class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium flex items-center gap-2">
                  <i class="fas fa-heart text-purple-500"></i>
                  持久更新
                </span>
              </div>

              <!-- 统计数据 -->
              <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">11 days</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">开发周期</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">6k+</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">代码量</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">开发人数</div>
                </div>
              </div>

              <!-- 行动按钮 -->
              <div class="flex gap-4 mt-8">
                <button class="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <i class="fas fa-rocket mr-2"></i>
                  立即体验
                </button>
                <button class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <i class="fab fa-github mr-2"></i>
                  GitHub
                </button>
              </div>
            </div>
          </div>

          <!-- 右上区域 -->
          <div
              class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg fade-in stagger-1 border border-gray-100 dark:border-gray-700"
              :class="{ 'visible': isVisible }"
          >
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  设计资源
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  基于业界最佳实践构建
                </p>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <i class="fab fa-react text-blue-500 text-sm"></i>
                <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Lucide Icons
                </span>
              </div>
            </div>

            <div class="icon-grid mb-4">
              <div
                  v-for="(icon, index) in lucideIcons"
                  :key="index"
                  class="icon-cell group"
              >
                <component
                    :is="icon.component"
                    class="w-5 h-5 text-gray-700 dark:text-gray-300 mb-2 group-hover:scale-110 transition-transform"
                />
                <span class="text-xs text-gray-600 dark:text-gray-400 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {{ icon.name }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span>Tailwind CSS + Vue3 + TypeScript </span>
              <span>完美兼容</span>
            </div>
          </div>
        </div>

        <!-- 下方区域 - 六大优点 -->
        <div
            class="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10 rounded-2xl p-8 lg:p-10 shadow-lg fade-in stagger-2 overflow-hidden"
            :class="{ 'visible': isVisible }"
        >
          <!-- 背景装饰 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-200 to-pink-200 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full -translate-y-32 translate-x-32 opacity-40"></div>

          <div class="relative z-10">
            <div class="text-center mb-12">
              <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                为什么选择
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">HC Utils</span>
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                我们专注于为用户提供最优雅、最高效的体验
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                  v-for="(advantage, index) in advantages"
                  :key="index"
                  class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 card-hover border border-white/20 fade-in hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                  :class="`stagger-${index + 3} ${isVisible ? 'visible' : ''}`"
              >
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <component
                      :is="advantage.icon"
                      class="w-6 h-6 text-white"
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {{ advantage.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {{ advantage.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性区域 -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 fade-in" :class="{ 'visible': isVisible }">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">核心功能展示</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            精心设计的工具集合，享受美好的数字生活
          </p>
        </div>

        <!-- 音乐播放功能 -->
        <div class="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div class="fade-in" :class="{ 'visible': isVisible }">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">智能音乐播放</h3>
                <p class="text-pink-500 dark:text-pink-400 text-sm">沉浸式听觉体验</p>
              </div>
            </div>

            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
              享受<span class="font-semibold text-pink-500">无损音质</span>的音乐播放体验，智能推荐系统为您发现新音乐，
              个性化播放列表让您的音乐收藏井然有序。
            </p>

            <ul class="space-y-4 mb-8">
              <li v-for="feature in musicFeatures" :key="feature" class="flex items-center text-gray-600 dark:text-gray-300 group">
                <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <i class="fas fa-check text-green-500 text-xs"></i>
                </div>
                <span class="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{{ feature }}</span>
              </li>
            </ul>

            <button class="inline-flex items-center gap-2 text-pink-500 dark:text-pink-400 font-medium hover:text-pink-600 dark:hover:text-pink-300 transition-colors">
              <span>了解更多功能</span>
              <i class="fas fa-arrow-right text-sm"></i>
            </button>
          </div>

          <!-- 播放器组件 -->
          <div class="fade-in stagger-1" :class="{ 'visible': isVisible }">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <!-- 播放器头部 -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Music class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">正在播放</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">3首歌曲 · 45分钟</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <MoreHorizontal class="w-5 h-5" />
                </button>
              </div>

              <!-- 当前歌曲 -->
              <div class="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <img
                    src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Album Cover"
                    class="w-14 h-14 rounded-lg object-cover shadow-md"
                >
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white truncate">Summer Vibes</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">The Chillhop Collective</p>
                </div>
                <button class="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart class="w-5 h-5" />
                </button>
              </div>

              <!-- 进度条 -->
              <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>2:14</span>
                  <span>3:45</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="player-progress rounded-full relative">
                    <div class="absolute -right-1 -top-1 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>

              <!-- 控制按钮 -->
              <div class="flex items-center justify-between">
                <button class="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <Shuffle class="w-5 h-5" />
                </button>
                <button class="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <SkipBack class="w-5 h-5" />
                </button>
                <button class="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <Play class="w-6 h-6" />
                </button>
                <button class="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <SkipForward class="w-5 h-5" />
                </button>
                <button class="text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                  <Repeat class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他功能网格 -->
        <div class="grid md:grid-cols-3 gap-8">
          <div
              v-for="feature in features"
              :key="feature.name"
              class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 card-hover fade-in hover:border-pink-200 dark:hover:border-pink-800"
              :class="`stagger-${feature.stagger} ${isVisible ? 'visible' : ''}`"
          >
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <component :is="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ feature.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {{ feature.description }}
            </p>
            <button class="inline-flex items-center gap-2 text-blue-500 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span>探索功能</span>
              <i class="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-3 mb-6 md:mb-0">
            <div class="w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-tools text-white text-sm"></i>
            </div>
            <span class="text-xl font-bold text-white">HC Utils</span>
          </div>
          <div class="text-gray-400 text-sm">
            &copy; 2025 HC Utils. 用心打造每一款工具
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Music,
  Video,
  Folder,
  Zap,
  Shield,
  Palette,
  Download,
  Star,
  Heart,
  Search,
  Settings,
  Play,
  Users,
  Repeat,
  SkipForward,
  SkipBack,
  Shuffle,
  MoreHorizontal
} from 'lucide-vue-next'

// 响应式数据
const isVisible = ref(false)

// Lucide 图标数据
const lucideIcons = [
  { component: Music, name: 'Music' },
  { component: Video, name: 'Video' },
  { component: Folder, name: 'Folder' },
  { component: Zap, name: 'Zap' },
  { component: Shield, name: 'Shield' },
  { component: Palette, name: 'Palette' },
  { component: Download, name: 'Download' },
  { component: Star, name: 'Star' },
  { component: Heart, name: 'Heart' },
  { component: Search, name: 'Search' },
  { component: Settings, name: 'Settings' },
  { component: Users, name: 'Users' }
]

// 六大优点
const advantages = [
  {
    title: '直观的用户界面',
    description: '精心设计的界面让每个功能都触手可及，无需学习成本即可上手使用。',
    icon: Palette
  },
  {
    title: '强大的性能',
    description: '优化的算法和架构确保所有工具都能快速响应，处理大型文件也不在话下。',
    icon: Zap
  },
  {
    title: '安全保障',
    description: '所有数据处理都在本地完成，保护您的隐私和数据安全。',
    icon: Shield
  },
  {
    title: '持续更新',
    description: '定期发布新功能和改进，确保您始终拥有最佳的使用体验。',
    icon: Download
  },
  {
    title: '个人创作',
    description: '由热爱技术的个人开发者独立打造，专注于用户需求和体验。',
    icon: Users
  },
  {
    title: '开源免费',
    description: '完全开源，免费使用，欢迎社区贡献和反馈。',
    icon: Heart
  }
]

// 音乐功能特性
const musicFeatures = [
  '支持 MP3, FLAC, WAV 等多种格式',
  '智能播放列表和歌曲推荐',
  '高质量音频输出',
  '歌词同步显示',
  '自定义均衡器设置'
]

// 功能特性
const features = [
  {
    name: '视频下载',
    description: '各大平台视频在线观看,一键下载到本地',
    icon: Video,
    stagger: 2
  },
  {
    name: '水印去除',
    description: '支持各大视频平台去水印,真正意义上的去水印',
    icon: Folder,
    stagger: 3
  },
  {
    name: '壁纸大全',
    description: 'Wallpaper/毒霸壁纸一键更换,静态精美图,动态壁纸,视频壁纸...',
    icon: Music,
    stagger: 1
  },
]

// 滚动动画处理
const handleScroll = () => {
  const elements = document.querySelectorAll('.fade-in')
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top
    const elementVisible = 150

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('visible')
    }
  })
}

onMounted(() => {
  isVisible.value = true
  window.addEventListener('scroll', handleScroll)
  setTimeout(handleScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
.stagger-5 { transition-delay: 0.5s; }

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-8px);
}

.player-progress {
  background: linear-gradient(to right, #ec4899 0%, #8b5cf6 100%);
  height: 8px;
  border-radius: 4px;
  width: 65%;
  transition: width 0.3s ease;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .icon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.dark .icon-cell {
  background: rgba(255, 255, 255, 0.03);
}

.icon-cell:hover {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.dark .icon-cell:hover {
  background: rgba(59, 130, 246, 0.1);
}
</style>