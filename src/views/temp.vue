<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">B站API测试页面</h1>

    <!-- 获取视频信息测试 -->
    <div class="card">
      <h2 class="text-lg font-semibold mb-4">获取视频信息</h2>
      <div class="flex gap-4 mb-4">
        <input
            v-model="videoBvid"
            placeholder="输入视频BV号 (如: BV1xx411c7mh)"
            class="input-field"
        />
        <button @click="testGetVideoInfo" class="btn-primary">
          测试获取视频信息
        </button>
      </div>
      <div v-if="videoResult" class="result-container">
        <h3 class="font-medium mb-2">响应结果:</h3>
        <pre class="result-pre">{{ videoResult }}</pre>
      </div>
    </div>

    <!-- 获取播放地址测试 -->
    <div class="card">
      <h2 class="text-lg font-semibold mb-4">获取播放地址</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">BV号:</label>
          <input v-model="playUrlParams.bvid" placeholder="BV1xx411c7mh" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">CID:</label>
          <input v-model.number="playUrlParams.cid" type="number" placeholder="123456789" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">AVID (可选):</label>
          <input v-model.number="playUrlParams.avid" type="number" placeholder="170001" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">清晰度 (可选):</label>
          <input v-model.number="playUrlParams.qn" type="number" placeholder="64" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">FNVAL (可选):</label>
          <input v-model.number="playUrlParams.fnval" type="number" placeholder="4048" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">4K (可选):</label>
          <input v-model.number="playUrlParams.fourk" type="number" placeholder="1" class="input-field" />
        </div>
      </div>
      <button @click="testGetPlayUrl" class="btn-primary">
        测试获取播放地址
      </button>
      <div v-if="playUrlResult" class="result-container">
        <h3 class="font-medium mb-2">响应结果:</h3>
        <pre class="result-pre">{{ playUrlResult }}</pre>
      </div>
    </div>

    <!-- 错误信息显示 -->
    <div v-if="error" class="error-container">
      <h3 class="font-medium text-red-800">错误信息:</h3>
      <pre class="error-pre">{{ error }}</pre>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      请求中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getVideoInfo, getPlayUrl } from '../api/videoParser/bilibili.ts'
import type { PlayUrlRequest } from '../types/video/bilibili.ts'

// 响应数据
const videoBvid = ref('')
const videoResult = ref<any>(null)
const playUrlResult = ref<any>(null)
const error = ref<string>('')
const loading = ref(false)

// 播放地址参数
const playUrlParams = reactive<PlayUrlRequest>({
  bvid: '',
  cid: 0,
  avid: undefined,
  qn: undefined,
  fnval: undefined,
  fourk: undefined
})

// 测试获取视频信息
const testGetVideoInfo = async () => {
  if (!videoBvid.value.trim()) {
    error.value = '请输入BV号'
    return
  }

  loading.value = true
  error.value = ''
  videoResult.value = null

  try {
    const response = await getVideoInfo(videoBvid.value)
    videoResult.value = response
  } catch (err: any) {
    error.value = err.message || '获取视频信息失败'
  } finally {
    loading.value = false
  }
}

// 测试获取播放地址
const testGetPlayUrl = async () => {
  if (!playUrlParams.bvid.trim() || !playUrlParams.cid) {
    error.value = '请填写BV号和CID'
    return
  }

  loading.value = true
  error.value = ''
  playUrlResult.value = null

  try {
    const response = await getPlayUrl({ ...playUrlParams })
    playUrlResult.value = response
  } catch (err: any) {
    error.value = err.message || '获取播放地址失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  placeholder-gray-500 dark:placeholder-gray-400;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md
  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed;
}

.result-container {
  @apply mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700;
}

.result-pre {
  @apply text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto;
}

.error-container {
  @apply mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800;
}

.error-pre {
  @apply text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap overflow-x-auto;
}

.loading-container {
  @apply fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg;
}
</style>