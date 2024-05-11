import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
process.env.SERVER_PORT = '0'

export default defineConfig({
  test: {
    // silent: false
    // ...
    coverage: {
      provider: 'v8'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
