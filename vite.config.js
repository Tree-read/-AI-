import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名 
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 配置代理
  // 解决跨域问题
  server: {
    proxy: {
      '/api': {
        //target 目标服务器地址(后端接口地址)
        target: 'http://159.75.169.224:1235',
        // 跨域请求时是否需要使用虚拟路径前缀
        changeOrigin: true,
        // 重写路径时，将 /api 前缀移除
        // 例如：/api/user/login 会变成 /user/login
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
