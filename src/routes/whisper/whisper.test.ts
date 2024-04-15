import { SERVER_NAME } from '@/utilities/environment.js'
import { expect, describe, test } from 'vitest'

describe('whisper routes integration test', () => {
  test('POST /whisper should exist', () => {
    console.log('funciona')
    console.log(fetch(`${SERVER_NAME}/whisper`, {
      method: 'POST'
    }))
  })
})
