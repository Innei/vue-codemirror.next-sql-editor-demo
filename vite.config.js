import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
const { resolve } = require('path')
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    tsconfigPaths({
      projects: [
        resolve(__dirname, './example/tsconfig.json'),
        resolve(__dirname, './tsconfig.json'),
      ],
    }),
    AutoImport({
      dts: './example/auto-import.d.ts',
      imports: ['vue'],
    }),
  ],
  root: resolve(__dirname, './example'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './example/index.html'),
      },
    },
  },
})
