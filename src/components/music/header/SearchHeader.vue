<!-- components/music/SearchHeader.vue -->
<template>
  <div class="bg-white/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm px-4 py-3">
    <div class="mx-auto flex items-center gap-2">
      <!-- 左侧内容 -->
      <ProButton
          type="ghost"
          size="sm"
          :icon="ArrowLeft"
          @click="$router.back()"
          tooltip="返回"
          tooltip-position="bottom"
      />
      <SearchSelect
          v-model="selectedApi"
          :options="playStore.apiOptions"
          size="sm"
          placement="bottom"
      />
      <div class="flex-1 max-w-md relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
            v-model="searchTemp"
            type="text"
            placeholder="搜索歌曲..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            @keyup.enter="handleSearch"
        />
      </div>
      <ProButton
          type="primary"
          size="sm"
          :icon="searchLoading ? undefined : Search"
          @click="handleSearch"
          tooltip="搜索"
          tooltip-position="bottom"
          :loading="searchLoading"
      />

      <!-- 右侧四个按钮 -->
      <div class="flex items-center gap-2 ml-auto mr-2">
        <!-- 公告按钮 -->
        <ProButton
            type="secondary"
            size="sm"
            :icon="Info"
            @click="showNotice = !showNotice"
            tooltip="帮助"
            tooltip-position="bottom"
        />
        <!-- 是否显示底部播放栏-->
        <ProButton
            type="secondary"
            size="sm"
            :icon="playStore.isShowBottomPlayer ? Eye : EyeOff"
            @click="playStore.toggleBottomPlayer"
            :tooltip="playStore.isShowBottomPlayer ? '隐藏底部播放栏' : '显示底部播放栏'"
            tooltip-position="bottom"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="FolderCog"
            @click="$emit('setting')"
            tooltip="设置下载目录"
            tooltip-position="bottom"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="TextSearch"
            @click="$emit('tab-change', 'search')"
            tooltip="搜索歌曲"
            tooltip-position="bottom"
            :class="activeTab === 'search' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="ListMusic"
            @click="$emit('tab-change', 'downloaded')"
            tooltip="已下载的歌曲"
            tooltip-position="bottom"
            :class="activeTab === 'downloaded' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="FolderHeart"
            @click="$emit('tab-change', 'favorite')"
            tooltip="收藏"
            tooltip-position="bottom"
            :class="activeTab === 'favorite' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
      </div>
    </div>
  </div>
  <!-- 系统公告 -->
  <NoticeBoard
      v-model:visible="showNotice"
      title="音乐帮助"
      :content="musicNotify"
      size="large"
      icon="info"
      :show-confirm-button="false"
      @close="showNotice = false"
      content-type="markdown"
  />
</template>

<script setup lang="ts">
import { ref, watch,computed } from 'vue'
import {ArrowLeft, Search, ListMusic, TextSearch, FolderCog, FolderHeart, Info, Eye, EyeOff} from 'lucide-vue-next'
import ProButton from '@/components/common/proButton.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import { usePlayerStore } from '../../../stores/playerStore.ts'
import {musicNotify} from "../../../text/musicNotify.ts"
import NoticeBoard from "@/components/common/NoticeBoard.vue";

const playStore = usePlayerStore()
interface Props {
  searchLoading?: boolean
  modelValue?: string
  initialApi?: 'qq' | 'wyy' | 'kw' | 'qishui'
  activeTab?: string
}
const props = withDefaults(defineProps<Props>(), {
  searchLoading: false,
  modelValue: '',
  initialApi: 'qq',
  activeTab: 'search'
})
const emit = defineEmits<{
  'update:modelValue': [value: string]  // 添加 update:modelValue
  'search': [keyword: string, api: string]
  'api-change': [api: string]
  'tab-change': [tab: string]
  'setting': []
}>()
const showNotice = ref(false)   // 搜索按钮加载状态

const searchTemp = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const selectedApi = ref(props.initialApi)

const handleSearch = () => {
  if (!searchTemp.value.trim()) return
  emit('search', searchTemp.value.trim(), selectedApi.value)
}

watch(selectedApi, (newApi) => emit('api-change', newApi))
</script>