import { describe, expect, test } from 'vitest'
import { createResponseBodyError } from './createResponseError.js'

describe('createResponseError', () => {
  test('should not return field if is not defined', () => {
    const response = createResponseBodyError({ type: 'ValidationError', message: 'Invalid email' })
    expect(response?.field).toBeNull()
  }
  )
})
