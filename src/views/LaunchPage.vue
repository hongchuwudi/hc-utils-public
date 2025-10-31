<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center overflow-hidden"
  >
    <div class="text-center relative">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>
      <!-- Logo 容器 -->
      <div
          class="w-32 h-32 mx-auto mb-8 relative"
          :class="logoAnimationClass"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-75 animate-spin-slow"></div>
        <img
            src="/favicon.ico"
            alt="HC Utils"
            class="w-full h-full rounded-full object-cover shadow-2xl relative z-10 border-4 border-white dark:border-gray-800"
        >
      </div>
      <!-- 软件名称 -->
      <div :class="nameContainerClass">
        <h1 class="text-5xl font-light text-gray-900 dark:text-white tracking-tight mb-2">
          HC Utils
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg font-light">
          多功能工具集合
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoAnimationClass = ref('opacity-0 scale-50 rotate-45')
const nameContainerClass = ref('opacity-0 translate-y-8')

onMounted(() => {
  // Logo 华丽入场
  setTimeout(() => {
    logoAnimationClass.value = 'opacity-100 scale-100 rotate-0 transition-all duration-1000 ease-out'
  }, 300)
  // 1.3秒后显示软件名称
  setTimeout(() => {
    nameContainerClass.value = 'opacity-100 translate-y-0 transition-all duration-800 ease-out'
  }, 1300)
  // 2.3秒后进入主页
  setTimeout(() => {
    // 添加退出动画
    logoAnimationClass.value = 'opacity-0 scale-110 transition-all duration-500 ease-in'
    nameContainerClass.value = 'opacity-0 -translate-y-4 transition-all duration-500 ease-in'
    setTimeout(() => {
      router.replace('/home')
    }, 500)
  }, 3000)
})
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
.transition-all {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>