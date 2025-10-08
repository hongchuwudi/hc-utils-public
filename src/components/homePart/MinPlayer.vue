<template>
  <div class="fade-in stagger-1" >
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
          <i class="fas fa-ellipsis-h"></i>
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
          <i class="fas fa-heart"></i>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>2:15</span>
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
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <i class="fas fa-random"></i>
        </button>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <i class="fas fa-step-backward"></i>
        </button>
        <button class="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <i class="fas fa-play text-lg"><Play></Play></i>
        </button>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <i class="fas fa-step-forward"></i>
        </button>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <i class="fas fa-redo"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Music, Play} from "lucide-vue-next";
</script>