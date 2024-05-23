import { describe, expect, test } from 'vitest'
import { getParsingErrorMessage } from './ParsingError.js'

describe('ParsingError tests', () => {
  test('it should not return supportedTypes', () => {
    expect(getParsingErrorMessage('audio')).toContain('audio')
  })
})
