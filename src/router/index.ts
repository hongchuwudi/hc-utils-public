import {createRouter, type RouteRecordRaw} from 'vue-router'
import { createWebHashHistory } from 'vue-router'
// import { createWebHistory } from 'vue-router'
// import { type RouteLocationNormalized, type RouteLocationNormalizedLoaded, } from 'vue-router'

// 路由组件(view)懒加载
const TestV = () => import('@/views/temp.vue')
const LaunchV = () => import('@/views/LaunchPage.vue')
const HomeV = () => import('@/views/Home.vue')
const NotFoundV = () => import('@/views/NotFoundView.vue')
const MusicV = () => import('@/views/Music.vue')
const AboutV = () => import('@/views/About.vue')
const SearchV = () => import('@/views/Search.vue')
const VideoV = () => import('@/views/Video.vue')
const gameV = () => import('@/views/Game.vue')
const userV = () => import('@/views/User.vue')
const wallpaperV = () => import('@/views/WallpaperManagement.vue')
const WatermarkV = () => import('@/views/Watermark.vue')
// 新增视频解析平台组件
const BilibiliParserV = () => import('@/views/video-parser/BilibiliParser.vue')
const DouyinParserV = () => import('@/views/video-parser/DouyinParser.vue')
const KuaishouParserV = () => import('@/views/video-parser/KuaishouParser.vue')


const rp = ['/','/home','/music','/video','/game','/about','/search','/user','/wallpaper','/watermark'] as const
const r404 = '/:pathMatch(.*)*' as  const
const vRp =['/video/bilibili', '/video/douyin', '/video/kuaishou' ] as const


// 路由配置
const routes: RouteRecordRaw[] = [
  // 测试路由
  {path:'/t', name: 'Test', component: TestV, meta: {title: '测试 - HC Utils', requiresAuth: false} },

  // 一级路由 - 主模块路由
  {path: rp[0], name: 'Launch', component: LaunchV, meta: {title: '启动 - HC Utils', requiresAuth: false}},
  {path: rp[1], name: 'Home', component: HomeV, meta: {title: '首页 - HC Utils', requiresAuth: false}},
  {path: rp[2], name:'Music', component: MusicV, meta: {title: '音乐 - HC Utils', requiresAuth: false},},
  {path: rp[3], name:'Video', component: VideoV, meta: {title: '视频 - HC Utils', requiresAuth: false}},
  {path: rp[4], name:'Game', component: gameV, meta: {title: '游戏 - HC Utils', requiresAuth: false}},
  {path: rp[5], name:'About', component: AboutV, meta: {title: '关于 - HC Utils', requiresAuth: false}},
  {path: rp[6], name: 'Search', component: SearchV, meta: {title: '搜索 - HC Utils', requiresAuth: false}},
  {path: rp[7], name: 'User', component: userV, meta: {title: '用户 - HC Utils', requiresAuth: false}},
  {path: rp[8], name: 'Wallpaper', component: wallpaperV, meta: {title: '壁纸 - HC Utils', requiresAuth: false}},
  {path: rp[9], name: 'Watermark', component: WatermarkV, meta: {title: '视频解析/去水印 - HC Utils', requiresAuth: false}},

  // 二级路由 - 视频解析平台路由
  {path: vRp[0], name: 'BilibiliParser', component: BilibiliParserV, meta: {title: '哔哩哔哩解析 - HC Utils', requiresAuth: false}},
  {path: vRp[1], name: 'DouyinParser', component: DouyinParserV, meta: {title: '抖音解析 - HC Utils', requiresAuth: false}},
  {path: vRp[2], name: 'KuaishouParser', component: KuaishouParserV, meta: {title: '快手解析 - HC Utils', requiresAuth: false}},

  // 404 页面必须放在最后
  {path: r404, name: 'NotFound', component: NotFoundV, meta: {title: '页面未找到 - HC Utils', requiresAuth: false}}
]


// 创建路由实例
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL), // webHistory 模式 需要浏览器支持 history.pushState
  history: createWebHashHistory(),                        // electron 使用 hash 模式
  routes,
  // 路由滚动行为
  // scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, savedPosition) {
  //   console.log('to', to, 'from', from, 'savedPosition', savedPosition)
  //   if (savedPosition) return savedPosition
  //   else return { top: 0 }
  // }
})




export default router