import { describe, expect, test } from 'vitest'
import { notSupportedFileTypeErrorMessage } from './NotSupportedFileTypeError.js'

describe('NotSupportedFileTypeError tests', () => {
  test('it should not return supportedTypes', () => {
    expect(notSupportedFileTypeErrorMessage('mp4')).not.toContain('mp5')
  })

  test('it should return supportedTypes', () => {
    const message = notSupportedFileTypeErrorMessage('mp4', ['mp3', 'mp5'])
    expect(message).toContain('mp3')
    expect(message).toContain('mp5')
  })
})
