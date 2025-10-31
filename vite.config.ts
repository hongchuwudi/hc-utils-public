import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './', // 资源路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: false, // false避免同时打开浏览器和 Electron
    proxy: {
      // API 请求代理
      '/api': {
        target: 'http://localhost:16666', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      },
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 确保构建后的资源路径正确
    // assetsDir: '.',
    rollupOptions: {
      output: {
        format: 'es',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})