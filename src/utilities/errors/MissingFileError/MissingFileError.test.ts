import { describe, expect, test } from 'vitest'
import { getMissingFileErrorMessage } from './MissingFileError.js'

describe('NotSupportedFileSizeError tests', () => {
  test('it should return mazSize and actual Size', () => {
    const message = getMissingFileErrorMessage('audio')
    expect(message).toContain('audio')
  })
})
