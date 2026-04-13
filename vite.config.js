import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium'

export default defineConfig({
  plugins: [cesium()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
