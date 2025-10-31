<!-- FavoriteHeader.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 py-2">
    <div class="flex items-center justify-between">
      <!-- 左侧：标题和统计 - 直接从 store 获取 -->
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">收藏歌曲</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          共 {{ favoriteStore.favoriteCount }} 首歌曲
        </p>
      </div>
      <!-- 右侧：按钮 - 直接调用 store 方法 -->
      <div class="flex items-center gap-2 mr-2">
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
        <!-- 刷新按钮 -->
        <ProButton
            type="secondary"
            size="sm"
            :icon="RefreshCw"
            @click="handleRefresh"
            tooltipPosition="bottom"
            tooltip="刷新"
            :loading="refreshing"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="Trash2"
            @click="confirmModal.openModal()"
            tooltipPosition="bottom"
            tooltip="清空"
            v-if="favoriteStore.favoriteCount > 0"
        />
        <!-- 切换按钮 -->
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
            :class="props.activeTab === 'search' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="ListMusic"
            @click="$emit('tab-change', 'downloaded')"
            tooltip="已下载的歌曲"
            tooltip-position="bottom"
            :class="props.activeTab === 'downloaded' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="FolderHeart"
            @click="$emit('tab-change', 'favorite')"
            tooltip="收藏"
            tooltip-position="bottom"
            :class="props.activeTab === 'favorite' ? 'bg-blue-100 dark:bg-blue-900' : ''"
        />
      </div>
    </div>
  </div>

  <!-- 清空确认提示框 -->
  <ConfirmModal
      ref="confirmModal"
      title="清空收藏"
      content="确定要清空所有收藏的歌曲吗？此操作不可恢复。"
      warningText="注意：这将删除所有收藏记录！"
      type="danger"
      confirmText="清空"
      @confirm="handleClear"
  />
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
import {ListMusic, TextSearch, FolderCog, FolderHeart, Trash2, RefreshCw, Info, Eye, EyeOff} from 'lucide-vue-next'
import ProButton from '@/components/common/proButton.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import {useFavoriteStore} from "../../../stores/favoriteStore.ts";
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import NoticeBoard from "@/components/common/NoticeBoard.vue";
import {musicNotify} from "../../../text/musicNotify.ts";
import {usePlayerStore} from "../../../stores/playerStore.ts";

const playStore = usePlayerStore()
const favoriteStore = useFavoriteStore()
const confirmModal = ref()
const refreshing = ref(false)
const showNotice = ref(false)

interface Props {activeTab?: string}
const props = withDefaults(defineProps<Props>(), {activeTab: 'favorite',})
const emit = defineEmits<{
  'tab-change': [tab: string], // 切换标签
  'setting': [], // 设置下载目录
  'refresh': []  // 刷新事件
}>()


// 清空收藏
const handleClear = async () => {
  try {
    favoriteStore.clearAll()
    message.success('清空成功')
  } catch (error: any) {
    message.error(error.message || '清空失败')
  }
}

// 刷新收藏列表
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await favoriteStore.refreshFavorites()
    // 触发刷新事件，让父组件知道要刷新列表
    emit('refresh')
    message.success('刷新成功, 当前收藏数量: ' + favoriteStore.favoriteCount)
  } catch (error: any) {
    message.error(error.message || '刷新失败')
  } finally {
    refreshing.value = false
  }
}
</script>