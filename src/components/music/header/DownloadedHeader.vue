<!-- DownloadedHeader.vue 修改部分 -->
<template>
  <div class="bg-white/80 dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm px-4 py-2">
    <div class="flex items-center justify-between">
      <!-- 左侧：标题和统计 -->
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">已下载的歌曲</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span v-if="useAppStore().musicStoragePath" class="mr-2">
            {{useAppStore().musicStoragePath}}
          </span>
          共 {{ downloadStore.songCount }} 首歌曲
          <span v-if="downloadStore.totalFileSize" class="">
            •{{ downloadStore.formatFileSize(downloadStore.totalFileSize) }}
          </span>
        </p>
      </div>

      <!-- 右侧：按钮 -->
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
        <ProButton
            type="secondary"
            size="sm"
            :icon="RefreshCw"
            @click="handleRefresh"
            tooltipPosition="bottom"
            tooltip="刷新"
            :loading="downloadStore.refreshing"
        />
        <ProButton
            type="secondary"
            size="sm"
            :icon="Trash2"
            @click="confirmModal.openModal()"
            tooltipPosition="bottom"
            tooltip="清空"
            v-if="downloadStore.songCount > 0"
        />
        <!-- 其他按钮保持不变 -->
        <ProButton
            type="secondary"
            size="sm"
            :icon="FolderCog"
            @click="$emit('setting')"
            tooltip="设置歌曲存储目录"
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
            :class="props.activeTab === 'favorite' ? 'bg-blue-100 dark:bg-blue-900 ' : ''"
        />
      </div>
    </div>
  </div>

  <!-- 清空确认提示框 -->
  <ConfirmModal
      ref="confirmModal"
      title="清空下载记录"
      content="确定要清空所有已下载的歌曲吗？此操作不可恢复。"
      warningText="注意：这将删除所有下载记录，同时会删除本地文件!"
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
import {TextSearch, ListMusic, FolderCog, FolderHeart, Trash2, RefreshCw, Info, Eye, EyeOff} from 'lucide-vue-next'
import ProButton from '@/components/common/proButton.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useDownloadStore } from '../../../stores/downloadStore.ts'
import { useAppStore } from '../../../stores'
import {musicNotify} from "../../../text/musicNotify.ts";
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import NoticeBoard from "@/components/common/NoticeBoard.vue";
import {usePlayerStore} from "../../../stores/playerStore.ts";

const playStore = usePlayerStore()
const downloadStore = useDownloadStore()
const appStore = useAppStore()
const confirmModal = ref()
const showNotice = ref(false) // 系统公告栏

interface Props { activeTab?: string }
const props = withDefaults(defineProps<Props>(), { activeTab: 'downloaded' })


// 刷新列表
const handleRefresh = async () => {
  try {
    await downloadStore.refreshList(appStore.musicStoragePath)
  } catch (error: any) {
    message.error(error.message || '刷新失败')
  }
}
// 清空所有下载
const handleClear = async () => {
  try {
    await downloadStore.clearAll(appStore.musicStoragePath)
    message.success('清空成功')
  } catch (error: any) {
    message.error(error.message || '清空失败')
  }
}
</script>