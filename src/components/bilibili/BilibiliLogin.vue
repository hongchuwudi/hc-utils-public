<!-- components/BilibiliLogin.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <!-- 标题和关闭按钮 -->
      <div class="flex items-center justify-between w-full mb-6">
        <div class="text-center flex-1">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">哔哩哔哩登录</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">扫码登录后即可使用完整功能</p>
        </div>
      </div>

      <!-- 二维码区域 -->
      <div v-if="qrcodeUrl" class="relative mb-6">
        <div class="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <img :src="qrcodeUrl" class="w-64 h-64 rounded-lg" />
        </div>

        <!-- 状态提示 -->
        <div class="mt-4 text-center">
          <div class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
               :class="statusClass">
            {{ statusMessage }}
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            打开哔哩哔哩APP扫描二维码
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3 justify-center flex-wrap w-full">
        <ProButton
            v-if="!qrcodeUrl && !bilibiliStore.userInfo"
            type="primary"
            :icon="LogIn"
            tooltip="开始登录"
            @click="startLogin"
            :loading="loading"
        />

        <ProButton
            v-else-if="showManualCheck"
            type="secondary"
            :icon="Check"
            tooltip="我已扫描"
            @click="manualCheckLogin"
            :loading="manualCheckLoading"
        />

        <ProButton
            v-if="qrcodeUrl"
            type="ghost"
            :icon="RefreshCw"
            tooltip="刷新二维码"
            @click="startLogin"
            :loading="loading"
        />

        <ProButton
            v-if="bilibiliStore.userInfo"
            type="ghost"
            :icon="LogOut"
            tooltip="退出登录"
            @click="logout"
        />
        <ProButton
            type="ghost"
            :icon="ArrowLeft"
            tooltip="返回"
            @click="handleClose"
        />
      </div>

      <!-- 登录成功显示 -->
      <div v-if="bilibiliStore.userInfo" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl w-full">
        <div class="flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle class="w-5 h-5 mr-2 flex-shrink-0" />
          <span class="font-medium">已登录用户: {{ bilibiliStore.userInfo.userId }}</span>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400 dark:text-gray-500">
          本应用承诺: 扫码登录不会有任何信息泄露风险,请放心使用。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed, watch } from 'vue'
import { CheckCircle, LogIn, Check, RefreshCw, LogOut, ArrowLeft } from 'lucide-vue-next'
import ProButton from '@/components/common/proButton.vue'
import { useBilibiliStore } from '../../stores/bilibiliCoooke.ts'
import { getQrcodeImage, pollLoginStatus, parseCookies } from '../../api/videoParser/bilibili'

const emit = defineEmits<{ close: [] }>()

const bilibiliStore = useBilibiliStore()

const qrcodeUrl = ref('')
const currentQrcodeKey = ref('')
const loading = ref(false)
const manualCheckLoading = ref(false)
const showManualCheck = ref(false)
const statusMessage = ref('等待扫描...')

let pollTimer: number | null = null
let expireTimer: number | null = null
let pollCount = 0
const maxPollCount = 15
const maxExpireTime = 120000

// 监听登录成功，自动关闭
watch(() => bilibiliStore.userInfo, (newVal) => {
  if (newVal) {
    // 登录成功，延迟一下让用户看到成功提示
    setTimeout(() => {
      handleClose()
    }, 1500)
  }
})

const handleClose = () => {
  resetTimers()
  emit('close')
}

// 状态样式计算
const statusClass = computed(() => {
  if (statusMessage.value.includes('成功')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (statusMessage.value.includes('过期') || statusMessage.value.includes('失败')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  if (statusMessage.value.includes('确认')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
})

const startLogin = async () => {
  resetState()
  loading.value = true

  try {
    const qr = await getQrcodeImage()
    qrcodeUrl.value = qr.base_url
    currentQrcodeKey.value = qr.qrcode_key
    startPolling()
    startExpireTimer()
    statusMessage.value = '等待扫描...'
  } catch (error) {
    console.error('获取二维码失败:', error)
    statusMessage.value = '获取二维码失败，请重试'
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  pollCount = 0
  pollTimer = window.setInterval(async () => {
    pollCount++

    if (pollCount > maxPollCount) {
      clearInterval(pollTimer!)
      showManualCheck.value = true
      statusMessage.value = '已停止自动检测，请点击"我已扫描"'
      return
    }

    await checkLoginStatus()
  }, 2000)
}

const checkLoginStatus = async () => {
  if (!currentQrcodeKey.value) return

  try {
    const res = await pollLoginStatus(currentQrcodeKey.value)

    if (res.code === 0) {
      handleLoginSuccess(res)
    } else if (res.code === 86038) {
      statusMessage.value = '二维码已过期，请刷新'
      resetTimers()
    } else if (res.code === 86090) {
      statusMessage.value = '二维码已扫描，请在手机上确认'
    } else if (res.code === 86101) {
      statusMessage.value = '等待扫描...'
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
}

const manualCheckLogin = async () => {
  if (!currentQrcodeKey.value) return

  showManualCheck.value = false
  statusMessage.value = '检查登录状态中...'
  manualCheckLoading.value = true

  try {
    await checkLoginStatus()
    if (!bilibiliStore.userInfo) {
      showManualCheck.value = true
      statusMessage.value = '检查完成，请确认是否已扫描'
    }
  } catch (error) {
    console.error('手动检查失败:', error)
    statusMessage.value = '检查失败，请重试'
    showManualCheck.value = true
  } finally {
    manualCheckLoading.value = false
  }
}

const handleLoginSuccess = (loginData: any) => {
  resetTimers()

  const cookies = parseCookies(loginData)
  bilibiliStore.setUserInfo(cookies.dedeUserID, cookies)

  statusMessage.value = '登录成功！'
  qrcodeUrl.value = ''
  currentQrcodeKey.value = ''
}

const startExpireTimer = () => {
  expireTimer = window.setTimeout(() => {
    resetTimers()
    qrcodeUrl.value = ''
    currentQrcodeKey.value = ''
    statusMessage.value = '二维码已过期，请刷新'
  }, maxExpireTime)
}

const logout = () => {
  bilibiliStore.clearUserInfo()
  resetState()
  statusMessage.value = '已退出登录'
}

const resetState = () => {
  resetTimers()
  qrcodeUrl.value = ''
  currentQrcodeKey.value = ''
  showManualCheck.value = false
  statusMessage.value = '等待扫描...'
  pollCount = 0
  loading.value = false
  manualCheckLoading.value = false
}

const resetTimers = () => {
  if (pollTimer) clearInterval(pollTimer)
  if (expireTimer) clearTimeout(expireTimer)
  pollTimer = null
  expireTimer = null
}

onUnmounted(() => resetTimers())
</script>