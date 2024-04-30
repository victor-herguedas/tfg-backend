import { describe, expect, test } from 'vitest'
import { parsingErrorMessage } from './ParsingError.js'

describe('ParsingError tests', () => {
  test('it should not return supportedTypes', () => {
    expect(parsingErrorMessage('audio')).toContain('audio')
  })
})
