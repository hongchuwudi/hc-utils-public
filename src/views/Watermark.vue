<script setup lang="ts">
import { getWatermarkByCGG } from '../api/watermark.ts'
const watermark = await getWatermarkByCGG('【【4K/60FPS】治愈神曲《𝐇𝐨𝐦𝐞𝐬𝐢𝐜𝐤》,无法超越的绝美画面!】https://www.bilibili.com/video/BV12h4y1c71H?vd_source=2894f4a0e0926a34f5dfc8e187d97a5b')
</script>

<template>
<video>
  <source :src="watermark" type="video/mp4"/>
</video>
</template>

<style scoped>

</style>