import { describe, expect, test, vi } from 'vitest'
import { CORS_ALLOWED_ORIGINS } from '../environment.js'

vi.hoisted(() => {
  process.env.CORS_ALLOWED_ORIGINS = 'http://localhost:3000,http://google.com:3003'
})

describe('environment', () => {
  test('It should be a cors list', () => {
    const expected = ['http://localhost:3000', 'http://google.com:3003']
    expect(expected[0]).toEqual(CORS_ALLOWED_ORIGINS[0])
    expect(expected[1]).toEqual(CORS_ALLOWED_ORIGINS[1])
  })
})
