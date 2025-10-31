<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- 装饰性背景元素 -->
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"></div>
      <div class="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-30 blur-lg"></div>
      <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-full opacity-20 blur-xl"></div>
      <div class="absolute bottom-40 right-1/3 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-30 blur-lg"></div>
    </div>

    <!-- 页面头部 -->
    <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 px-1 py-1 mb-3 z-10">
      <div class="max-w-8xl mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
                @click="$router.go(-1)"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">关于作者</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0">探索我的技术世界与成长历程</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 mr-4">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              Vue3 前端开发
            </span>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium ">
              Java/Go 后端开发
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative max-w-8xl mx-auto px-4 z-10">
      <div class="grid grid-cols-12 gap-4">
        <!-- 左侧：作者信息 -->
        <div class="col-span-3">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 h-full transition-all duration-300 hover:shadow-xl">
            <!-- 头像区域 -->
            <div class="flex flex-col items-center text-center mb-6">
              <div class="relative w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-white dark:ring-gray-800">
                <img src="../../public/favicon.ico">
                <!-- 在线状态指示器 -->
                <div class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
              </div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">虹初 (hongchu)</h2>
              <span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium mb-3">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                全栈开发工程师
              </span>
              <p class="text-sm text-gray-600 dark:text-gray-400">热爱编程，专注Java后端与全栈开发</p>
            </div>

            <!-- 基本信息 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  年龄
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">20岁</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  地址
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">陕西西安</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  编程经验
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">2年</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  QQ
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">2772167017</span>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  github
                </span>
                <a href="https://bgithub.xyz/hongchuwudi" target="_blank" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">github.com/hongchuwudi</a>
              </div>
              <div class="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600/50">
                <span class="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  email
                </span>
                <a href="https://bgithub.xyz/hongchuwudi" target="_blank" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">wudi6815@163.com</a>
              </div>
            </div>

            <!-- 联系按钮 -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                联系我
              </button>
            </div>
          </div>
        </div>

        <!-- 中间：活跃度和技术栈 -->
        <div class="col-span-6">
          <div class="space-y-4 h-full flex flex-col">
            <!-- 活跃度贪吃蛇 -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 flex-1 transition-all duration-300 hover:shadow-xl">
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">开发活跃度</h3>
              </div>
              <SnakeAnimation />
            </div>

            <!-- 技术栈部分 - 替换现有代码 -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 flex-1 transition-all duration-300 hover:shadow-xl">
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">技术栈</h3>
              </div>

              <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟悉计算机网络TCP/IP协议栈和常见数据结构和算法，如链表、树、哈希表、排序、DP、回溯</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>了解C/C++ OOP、泛型编程、C++11 Lambda表达式 和 Golang函数式编程、OOP、error接口</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟悉 Java OOP，常见集合框架arrayList、HashMap等，Lamdab编程，IO流，了解反射、注解</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟练掌握 <strong>MySQL</strong> 的DDL、DML、DQL，深入理解事物ACID 与锁机制、Innodb存储、索引机制</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟练掌握 <strong>SpringAI</strong> 、 <strong>SpringBoot</strong> 、<strong>Mybatis</strong>等框架中间件，了解IOC、AOP、Bean声明周期,依赖注入原理,了解<strong>JUC</strong>并发编程、如多线程实现、锁机制 和 <strong>JVM</strong>虚拟机GC流程
                  </span>
                </div>
                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟悉常见的<strong>设计模式</strong>如工厂模式、单例模式、享元模式等</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟悉HTML、CSS、JavaScript、<strong>Vue3</strong>、Vue router、pinia等前端技术</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>了解Redis缓存中间键底层数据结构、内存淘汰策略、持久化机制</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>熟悉Docker 容器化部署及其指令、了解Linux 基本指令和vim/nano的基本使用</span>
                </div>

                <div class="flex items-start">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>了解ollama本地部署大模型和<strong>AI应用开发</strong>常用模式如Prompt问答、RAG等模式</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：开发环境和荣誉 -->
        <div class="col-span-3">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 h-full transition-all duration-300 hover:shadow-xl">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">开发环境</h3>
            </div>

            <div class="space-y-4">
              <!-- 开发工具 -->
              <div class="grid grid-cols-1 gap-3">
                <div class="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl p-3 border border-gray-200 dark:border-gray-600/30 transition-all duration-300 hover:shadow-md">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">操作系统</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">Windows 11 / Ubuntu 22.04</div>
                </div>
                <div class="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl p-3 border border-gray-200 dark:border-gray-600/30 transition-all duration-300 hover:shadow-md">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">版本控制</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">Git + GitHub</div>
                </div>
                <div class="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl p-3 border border-gray-200 dark:border-gray-600/30 transition-all duration-300 hover:shadow-md">
                  <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">数据库工具</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">DataGrip</div>
                </div>
              </div>
              <!-- 开发软件 -->
              <div class="space-y-3">
                <div v-for="(section, key) in devEnvironmentSections" :key="key">
                  <button
                      @click="toggleSection(key)"
                      class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-600/30 dark:hover:to-slate-600/30 transition-all duration-300 border border-gray-200 dark:border-gray-600/30"
                  >
                    <span class="font-medium text-gray-900 dark:text-white text-sm">{{ section.title }}</span>
                    <svg
                        class="w-4 h-4 text-gray-500 transition-transform duration-300"
                        :class="{ 'rotate-180': expandedSections[key] }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <div v-show="expandedSections[key]" class="mt-2 p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl border border-gray-200 dark:border-gray-600/30 transition-all duration-300">
                    <div class="space-y-2 text-sm">
                      <div v-for="(value, prop) in section.data" :key="prop" class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-600/30 last:border-0">
                        <span class="text-gray-600 dark:text-gray-400">{{ prop }}:</span>
                        <span class="font-medium text-gray-900 dark:text-white text-right">{{ value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 第三行：项目经历 - 全宽设计 -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl mt-4">
        <div class="flex items-center mb-6">
          <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">项目经历</h3>
        </div>

        <div class="space-y-6">
          <!-- 项目一 -->
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:shadow-lg">
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">AI智能助手系统（2025年4月）</h4>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">Spring AI + Ollama</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              基于Spring AI框架开发的智能对话系统，支持文本/文件多模态交互，实现企业级对话记忆管理。
            </p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">核心功能：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 搭建大模型对话服务，集成Ollama本地模型，定制AI人格</li>
                  <li>• 设计多模态交互API，支持文本/图片/文档混合输入的AI对话</li>
                  <li>• 开发会话历史管理模块，按业务类型分类存储</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">技术亮点：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 大模型集成：通过ChatClient封装Prompt工程，集成系统角色设定</li>
                  <li>• 对话记忆优化：实现RedisChatMemory持久化消息记录</li>
                  <li>• 高性能存储：使用Redis Set存储会话ID列表</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Spring Boot 3.x</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Spring AI</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Ollama</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Redis</span>
            </div>
          </div>

          <!-- 项目二 -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800/30 transition-all duration-300 hover:shadow-lg">
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">乐享生活服务平台（2025年5月）</h4>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">全栈开发</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              基于Spring Boot + Vue3的前后端分离订餐系统，涵盖用户、商家、管理全业务流程。
            </p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">担任角色：</h5>
                <p class="text-gray-600 dark:text-gray-400">Java后端开发 - 用户登录、商品订单下单操作等代码编写</p>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mt-3 mb-2">主要开发内容：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 通过WebSocket实现来单提醒功能</li>
                  <li>• SpringTask定时任务实现订单超时自动取消</li>
                  <li>• 接入微信支付沙箱环境，完成支付回调逻辑</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">技术亮点：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• MyBatis + pageHelper实现多条件分页查询，性能提升80%</li>
                  <li>• Redis + 本地缓存策略，热门菜品访问命中率95%</li>
                  <li>• JWT + ThreadLocal实现登录认证和请求拦截</li>
                  <li>• Redis实现token自动续期和JWT主动失效</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-200 dark:border-green-800">Spring Boot</span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-200 dark:border-green-800">Vue 3</span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-200 dark:border-green-800">MySQL</span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-200 dark:border-green-800">Redis</span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-200 dark:border-green-800">WebSocket</span>
            </div>
          </div>

          <!-- 项目三 -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30 transition-all duration-300 hover:shadow-lg">
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">教育知识库-智慧学习平台（2025年6月）</h4>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">独立全栈开发</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              基于Spring Boot + Vue3的学校教材管理系统，涵盖用户、管理双端系统。项目地址: http://121.43.199.189/
            </p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">担任角色：</h5>
                <p class="text-gray-600 dark:text-gray-400">结合AI实现全栈开发流程</p>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mt-3 mb-2">项目亮点：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 所有代码均独立完成，部分参考AI-Deepseek生成，耗时14天</li>
                  <li>• 前端使用Vue3组合式API+Pinia状态管理</li>
                  <li>• 封装请求拦截响应器，组件复用率提升40%</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">技术架构：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 后端基于Spring Boot 3.x构建，集成MyBatis-Plus</li>
                  <li>• Redis缓存热门教材，减少用户访问时间和服务器压力</li>
                  <li>• Nginx实现负载均衡和反向代理</li>
                  <li>• 静态资源响应时间&lt;300ms</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-800">Spring Boot 3.x</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-800">Vue 3</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-800">Element Plus</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-800">Nginx</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-800">Redis</span>
            </div>
          </div>

          <!-- 项目四 -->
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 transition-all duration-300 hover:shadow-lg">
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white">智选未来-高考智能助手（2025年8月-2025年9月）</h4>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">GORM + Vue3</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              基于golang的gorm,net/http和vue3 开发的高考智能服务平台，支持AI对话,志愿填报,高校/专业查询,家庭共享等功能。
            </p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">核心功能：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 高考志愿推荐,根据用户高考数据进行智能匹配合适的大学和专业,并结合AI给出完美建议</li>
                  <li>• 高校/专业查询,提供学校/专业录取最低分信息查询,地理位置,介绍视频,印象标签最全面的信息</li>
                  <li>• AI对话服务,聊天对话，基于Qwen模型，支持多文本格式,多轮记忆绘话,聊天记录持久化</li>
                  <li>• 好友系统,添加好友，实时好友聊天,消息推送,聊天记录持久化</li>
                  <li>• 志愿填报,用户可填写志愿信息，系统将志愿信息保存至数据库，并生成志愿表</li>
                  <li>• 咨询论坛,支持HTML格式和Markdown格式的内容发布,订阅,点赞,评论以及转发功能</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">技术亮点：</h5>
                <ul class="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 通过java JDBC多线程/IO流脚本程序高速,合理,批量爬取掌上高考百万数据</li>
                  <li>• 使用redis缓存高考热门院校,将原本MySQL数据查询速度优化至<10ms</li>
                  <li>• 使用EXPLAIN分析查询,索引优化以及启用慢查询日志将百万录取数据筛选查询速度提升至<10ms</li>
                  <li>• 通过AES对称加密传递重要百度地图秘钥至前端以及单向哈希+随机盐存储用户密码,提高安全性</li>
                  <li>• 使用websocket建立长连接，实时监测登录状态，实现实时推送消息</li>
                  <li>• 破解掌上高考referrer防盗链,成功盗链视频链接于自己网站中使用</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">GORM</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Vue3</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Mysql</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Redis</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-800">Ant Design</span>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SnakeAnimation from '@/components/donghua/SnakeAnimation.vue'

export default {
  name: 'AboutAuthor',
  components: {
    SnakeAnimation
  },
  setup() {
    const expandedSections = ref({
      ide: true,
      database: false,
      tools: false
    })

    const devEnvironmentSections = {
      ide: {
        title: '开发工具',
        data: {
          'Java IDE': 'IntelliJ IDEA',
          '前端 IDE': 'Visual Studio Code',
          '数据库工具': 'MySQL Workbench 8.0'
        }
      },
      database: {
        title: '数据库环境',
        data: {
          '主数据库': 'MySQL 8.0',
          '缓存数据库': 'Redis 7.x',
          '版本控制': 'Git/GitHub'
        }
      },
      tools: {
        title: '其他工具',
        data: {
          'API测试': 'APIfox',
          '容器化': 'Docker',
          '服务器': 'Ubuntu 22.04 LTS'
        }
      }
    }

    const toggleSection = (key) => {
      expandedSections.value[key] = !expandedSections.value[key]
    }

    return {
      expandedSections,
      devEnvironmentSections,
      toggleSection
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 暗色模式滚动条 */
.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>