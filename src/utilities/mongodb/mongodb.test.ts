import { describe, expect, test } from 'vitest'
import { mongodbConnection } from './mongodb.js'

describe('mongodb', () => {
  test('should connect to mongodb', async () => {
    expect(mongodbConnection).toBeDefined()
    expect(mongodbConnection.readyState).toBe(1)
  })
})
