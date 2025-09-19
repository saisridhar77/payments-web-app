import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// export default defineConfig({
//   plugins: [react()],
//   mo

// })


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.201.35.204:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});