import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 这里必须替换为你的仓库名，前后都要有斜杠
  base: '/ai-interview-bp/',
})