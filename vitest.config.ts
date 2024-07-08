import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
process.env.SERVER_PORT = '0'
process.env.NODE_ENV = 'test'
process.env.USE_REAL_AI_API = 'false'
process.env.USE_REAL_S3_API = 'false'

export default defineConfig({
  test: {
    // setupFiles: ['./src/test/setupTest.ts'],
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
