/// <reference types="vite/client" />

// Vue 文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// TypeScript/JavaScript 文件
declare module '*.ts' {
  const content: any
  export default content
}

declare module '*.js' {
  const content: any
  export default content
}

// 其他常见文件类型
declare module '*.json' {
  const content: any
  export default content
}

declare module '*.css' {
  const content: any
  export default content
}

declare module '*.scss' {
  const content: any
  export default content
}

// 图片等资源文件
declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

// Vite 环境变量
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 添加其他环境变量
  readonly VITE_API_BASE_URL: string
  readonly VITE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}