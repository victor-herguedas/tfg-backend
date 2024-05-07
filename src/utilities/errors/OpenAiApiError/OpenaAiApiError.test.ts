import { describe, expect, test } from 'vitest'
import { openAiAPiErrorMessage } from './OpenAiApiError.js'

describe('OpenAiApiError tests', () => {
  test('it should return whisper', () => {
    expect(openAiAPiErrorMessage('whisper')).toContain('whisper')
  })
})
