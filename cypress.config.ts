import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    VITE_CLIENT_URL: 'https://gopassjerry.vercel.app'
  },
})
