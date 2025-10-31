<template>
  <BilibiliLogin v-if="showLogin" @close="showLogin = false"></BilibiliLogin>
  <TestVidePlay
      videoSrc="https://upos-sz-estgcos.bilivideo.com/upgcxcode/94/53/1080025394/1080025394-1-30080.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&mid=1785017192&nbs=1&gen=playurlv3&og=cos&uipk=5&trid=7f3a454701f44db88d2a81ee48284f6u&deadline=1760332065&os=estgcos&platform=pc&oi=3683689634&upsig=641570e8a0d5e66f0251ca806c2cc167&uparams=e,mid,nbs,gen,og,uipk,trid,deadline,os,platform,oi&bvc=vod&nettype=0&bw=2647157&dl=0&f=u_0_0&agrr=0&buvid=&build=0&orderid=0,3"
      audioSrc="https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/94/53/1080025394/1080025394-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&oi=3683689634&mid=1785017192&deadline=1760332065&os=cosbv&og=cos&nbs=1&platform=pc&trid=7f3a454701f44db88d2a81ee48284f6u&gen=playurlv3&uipk=5&upsig=cb0aa373e90b8401e7f2ed2cdd58eba2&uparams=e,oi,mid,deadline,os,og,nbs,platform,trid,gen,uipk&bvc=vod&nettype=0&bw=211648&dl=0&f=u_0_0&agrr=0&buvid=&build=0&orderid=0,3"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVideoPlayerStore } from '../../stores/bilibiliM4splayStore.ts'
import BilibiliLogin from '@/components/bilibili/BilibiliLogin.vue'
import TestVidePlay from '@/components/bilibili/TestVidePlay.vue'

const store = useVideoPlayerStore()
store.play()
const showLogin = ref(true)
</script>