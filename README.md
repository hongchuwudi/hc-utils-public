# 🎵 HC Utils - 多功能桌面工具集

## 📖 项目介绍

**HC Utils** 是一个基于 Electron + Vue 3 的现代化多功能桌面应用，集成了音视频播放、工具集合等功能。采用现代化的技术栈，提供原生桌面应用的体验。

### 🌟 核心特性
- **跨平台桌面应用**: 基于 Electron，支持 Windows、macOS、Linux
- **全格式音视频支持**: MP3, WAV, OGG, M3U8 等主流音视频格式
- **现代化界面**: 基于 Ant Design Vue 的优雅 UI 设计
- **安全加密**: 内容加密保护，保障媒体资源安全
- **高性能**: 基于 Vite 构建，快速加载和响应
- **便携式打包**: 支持便携式应用打包，无需安装

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 pnpm 包管理器
- 支持的操作系统：Windows 7+, macOS 10.10+, Linux

### 安装步骤

1. **克隆项目**
```bash
git clone git@github.com:hongchuwudi/hc-utils-public.git
cd hc-utils-web
```

2. **安装依赖**
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

3. **开发模式运行**
```bash
# 启动 Electron 开发模式（同时启动 Vite 开发服务器和 Electron）
npm run electron:dev
```

4. **构建生产版本**
```bash
# 构建 Web 应用
npm run build

# 构建 Electron 桌面应用
npm run electron:build
```

5. **直接运行桌面应用**
```bash
# 构建并运行 Electron 应用
npm run electron:serve
```

## 🛠 技术栈

### 桌面应用框架
- **Electron** - 跨平台桌面应用框架
- **electron-builder** - Electron 应用打包工具

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### 状态管理 & 路由
- **Pinia** - Vue 官方推荐的状态管理库
- **Vue Router** - Vue.js 官方路由管理器
- **pinia-plugin-persistedstate** - 状态持久化插件

### 样式 & UI
- **Ant Design Vue** - 企业级 UI 设计语言
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide Vue** - 精美的图标库

### 媒体播放
- **Howler.js** - 现代 Web 音频库
- **Wavesurfer.js** - 音频波形可视化库

### 工具库
- **VueUse** - Vue 组合式工具集合
- **Lodash-es** - JavaScript 实用工具库
- **Axios** - HTTP 请求库

## 📁 项目结构

```
hc-utils-web/
├── src/                    # 前端源码
│   ├── components/        # 可复用组件
│   ├── views/            # 页面组件
│   ├── stores/           # Pinia 状态管理
│   ├── router/           # 路由配置
│   ├── utils/            # 工具函数
│   ├── assets/           # 静态资源
│   ├── styles/           # 样式文件
│   ├── App.vue           # 根组件
│   └── main.ts           # 前端入口文件
├── dist-electron/         # Electron 主进程编译输出
│   └── main.js           # Electron 主进程文件
├── electron/              # Electron 主进程源码
│   └── main.ts           # Electron 主进程入口
├── public/               # 公共资源
├── dist/                 # 前端构建输出
├── dist_electron_build/  # Electron 应用打包输出
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tsconfig.electron.json # Electron TS 配置
├── tailwind.config.js    # Tailwind 配置
└── package.json          # 项目依赖
```

## 🎯 功能模块

### 桌面应用特性
- **原生窗口管理**: 自定义窗口控件、菜单栏
- **系统集成**: 系统托盘、全局快捷键
- **文件系统访问**: 本地文件读写操作
- **自动更新**: 应用自动更新机制

### 音乐播放器
- 支持多种音频格式播放
- 音频波形可视化
- 播放列表管理
- 音量控制和时间轴

### 视频播放器
- M3U8 流媒体支持
- 清晰度切换
- 全屏播放
- 播放速度控制

### 工具集合
- 多种实用工具集成
- 简洁高效的操作界面
- 数据持久化存储

## 📦 构建和部署

### 开发环境
```bash
# 启动 Electron 开发模式（热重载）
npm run electron:dev

# 仅构建 Electron 主进程
npm run electron:build-main

# 类型检查
npm run build:type-check
```

### 生产构建
```bash
# 构建 Web 应用
npm run build

# 构建 Electron 桌面应用（便携式）
npm run electron:build

# 预览 Web 构建
npm run preview
```

### 打包配置
- **输出格式**: 便携式应用（无需安装）
- **平台架构**: x64
- **打包工具**: electron-builder
- **输出目录**: `dist_electron_build`

## 🔧 配置说明

### Electron 配置
在 `package.json` 的 `build` 字段中配置：
```json
{
  "appId": "com.hongchu.hc-utils-web",
  "productName": "HCUtils",
  "directories": {
    "output": "dist_electron_build"
  },
  "files": [
    "dist/**/*",
    "dist-electron/**/*"
  ],
  "win": {
    "target": "portable",
    "icon": "public/favicon.ico"
  }
}
```

### 开发脚本说明
- `electron:dev` - 开发模式，支持热重载
- `electron:serve` - 直接运行打包后的应用
- `electron:build` - 构建可分发应用
- `electron:build-main` - 仅编译主进程

## 🤝 开发贡献

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 Vue 3 组合式 API 规范
- 统一的代码格式化规则

### 提交规范
```bash
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 代码样式调整
refactor: 代码重构
electron: Electron 相关改动
```

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🆘 技术支持

如有问题请提交 Issue 或联系开发团队

---

**HC Utils** - 让桌面应用开发更简单、更高效！ 🚀
