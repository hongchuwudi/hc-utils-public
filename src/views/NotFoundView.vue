<template>
  <div
      class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      :style="{ height: containerHeight }"
  >
    <div class="max-w-2xl w-full text-center">
      <!-- 404图形 -->
      <div class="relative mb-8">
        <div class="floating text-9xl font-bold text-blue-500 dark:text-blue-400 opacity-20 select-none">404</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fas fa-search-minus text-6xl text-blue-600 dark:text-blue-300 floating" style="animation-delay: 0.5s;"></i>
        </div>
      </div>

      <!-- 主要内容 -->
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">页面未找到</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移动。可能是URL输入错误，或者页面已被删除。
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button @click="goHome" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
          <i class="fas fa-home"></i>
          返回首页
        </button>
        <button @click="goBack" class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
          <i class="fas fa-arrow-left"></i>
          返回上页
        </button>
        <button @click="searchSite" class="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
          <i class="fas fa-search"></i>
          站内搜索
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {message} from "ant-design-vue";

const props = defineProps({
  isHeaderCollapsed: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()

// 动态计算容器高度
const containerHeight = computed(() => {
  const baseHeight = '100vh'
  const headerOffset = props.isHeaderCollapsed ? '0rem' : '3.5rem'
  return `calc(${baseHeight} - ${headerOffset})`
})

const goHome = () => router.push('/')
const goBack = () => router.go(-1)
const searchSite = () => message.success('搜索功能0.0')

</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.floating {
  animation: float 3s ease-in-out infinite;
}
</style>