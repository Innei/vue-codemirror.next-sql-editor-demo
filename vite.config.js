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
        resolve(__dirname, './app/tsconfig.json'),
        resolve(__dirname, './tsconfig.json'),
      ],
    }),
    AutoImport({
      dts: './app/auto-import.d.ts',
      imports: ['vue'],
    }),
  ],
  root: resolve(__dirname, './app'),

  build: {
    target: 'chrome92',

    // lib: {
    //   entry: './src/index.ts',
    //   name: 'sql-editor',
    //   formats: ['es'],
    // },
    rollupOptions: {
      input: {
        main: resolve(__dirname, './app/index.html'),
      },
    },
  },
})
