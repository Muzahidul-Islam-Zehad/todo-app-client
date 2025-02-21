import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    watch: {
      usePolling: true, // Ensures file watching works correctly
    },
    host: true, // Allows access from different devices (optional)
  },
})
