import { describe, expect, test } from 'vitest'
import { missingFileErrorMessage } from './MissingFileError.js'

describe('NotSupportedFileSizeError tests', () => {
  test('it should return mazSize and actual Size', () => {
    const message = missingFileErrorMessage('audio')
    expect(message).toContain('audio')
  })
})
