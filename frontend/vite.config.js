import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  preview: {
    allowedHosts: ['port-0-cinepark-frontend-mm0ur6nb0ab5ea2b.sel3.cloudtype.app'],
  },
})
