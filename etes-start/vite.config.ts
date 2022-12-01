import { defineConfig } from 'vite'
import etes from 'vite-plugin-etes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [etes()],
})
