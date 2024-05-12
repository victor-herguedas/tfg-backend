import { describe, test } from 'vitest'
import { connectMongoDB } from './mongodb.js'

describe('mongodb', () => {
  test('should connect to mongodb', async () => {
    await connectMongoDB()
  })
})
