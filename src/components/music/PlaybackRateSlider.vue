<template>
  <div class="relative flex items-center group">
    <!-- 触发按钮 -->
    <button
        class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        :title="`倍速: ${displayRate.toFixed(1)}x`"
    >
      <Gauge class="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </button>

    <!-- 悬浮控制面板 -->
    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <!-- 倍速显示和输入 -->
        <div class="text-center mb-2 flex items-center justify-center gap-1">
          <input
              v-model.number="inputRate"
              type="number"
              step="0.1"
              min="0.1"
              max="3.0"
              class="w-11 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-1 py-1 bg-transparent"
              @change="handleInputChange"
              @keyup.enter="handleInputChange"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">x</span>
        </div>

        <!-- 竖 progress bar -->
        <div class="flex items-center gap-3">
          <!-- 刻度标记（可点击） -->
          <div class="flex flex-col items-center justify-between h-24 text-xs text-gray-400">
            <span class="cursor-pointer hover:text-blue-500 transition-colors" @click="setRate(3.0)">3.0x</span>
            <span class="cursor-pointer hover:text-blue-500 transition-colors" @click="setRate(2.0)">2.0x</span>
            <span class="cursor-pointer hover:text-blue-500 transition-colors" @click="setRate(1.0)">1.0x</span>
            <span class="cursor-pointer hover:text-blue-500 transition-colors" @click="setRate(0.5)">0.5x</span>
          </div>

          <!-- 进度条 -->
          <ProgressBar
              :current="calculateProgressValue(displayRate)"
              :total="290"
              :vertical="true"
              :show-time="false"
              @update:current="handleRateChange"
              vertical-type="rate"
              class="h-24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Gauge } from 'lucide-vue-next'
import ProgressBar from '@/components/common/ProgressBar.vue'

interface Props { modelValue: number,min?: number,max?: number }
const props = withDefaults(defineProps<Props>(), { min: 0.1, max: 3.0 })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const displayRate = computed(() => props.modelValue)
const inputRate = ref(props.modelValue.toFixed(1))

// 当外部 modelValue 变化时更新输入框
watch(displayRate, (newRate) => {
  inputRate.value = newRate.toFixed(1)
})

const calculateProgressValue = (rate: number) => (rate - 0.1) * 100
const calculateRateFromProgress = (progress: number) => (progress / 100) + 0.1

// 点击刻度设置倍速
const setRate = (rate: number) => {
  inputRate.value = rate.toFixed(1)
  emit('update:modelValue', rate)
}

// 输入框变化处理
const handleInputChange = () => {
  let rate = parseFloat(inputRate.value)
  if (isNaN(rate)) rate = 1.0
  rate = Math.max(0.1, Math.min(3.0, rate))
  inputRate.value = rate.toFixed(1)
  emit('update:modelValue', rate)
}

// 直接处理进度条变化，无防抖
const handleRateChange = (progressValue: number) => {
  const rate = calculateRateFromProgress(progressValue)
  let finalRate = rate

  // 吸附判断
  const snapPoints = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
  const snapThreshold = 0.099
  for (const snapPoint of snapPoints) {
    if (Math.abs(rate - snapPoint) <= snapThreshold) {
      finalRate = snapPoint
      break
    }
  }

  // 更新输入框并立即提交
  inputRate.value = finalRate.toFixed(1)
  emit('update:modelValue', finalRate)
}
</script>