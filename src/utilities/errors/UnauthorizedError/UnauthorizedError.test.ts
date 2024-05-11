import { describe, expect, test } from 'vitest'
import { getUnauthorizedErrorMessage } from './UnauthorizedError.js'

describe('UnauthorizedError tests', () => {
  test('should generate error message with subType Unauthorized', () => {
    expect(getUnauthorizedErrorMessage('Unauthorized')).toBe('Unauthorized')
  }
  )
})
