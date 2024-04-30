import { describe, expect, test } from 'vitest'
import { notSupportedFileSizeErrorMessage } from './NotSupportedFileSizerError.js'

describe('NotSupportedFileSizeError tests', () => {
  test('it should return mazSize and actual Size', () => {
    const message = notSupportedFileSizeErrorMessage('500', '200')
    expect(message).toContain('500')
    expect(message).toContain('200')
  })
})
