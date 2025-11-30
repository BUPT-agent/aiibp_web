import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 注意：这里必须是 '/aiibp_web/'，因为你的仓库名是 aiibp_web
  base: '/aiibp_web/',
})