import {resolve} from 'path'
import {defineConfig, externalizeDepsPlugin} from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {

    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src')
      },
      extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/css/common.less";`,
        },
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/renderer/src/assets/style/variables.less')}";`
          }
        }
      }
    },
    server: {
      host: true,
    },
  }
})
