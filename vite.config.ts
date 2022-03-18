import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@/reactivity': path.resolve(__dirname, '/packages/reactivity'),
      'cx': path.resolve(__dirname, '/packages/cx')
    }
  }
})
