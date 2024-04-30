import { describe, expect, test } from 'vitest'
import { whisperTranscribe } from './whisperService.js'
import path from 'path'
import { MEDIA_PATH, PAID_TEST } from '../../../utilities/environment.js'

describe('whisper openAi api', () => {
  if (PAID_TEST) {
    test('integration whisper', async () => {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('talento')
    })
  }

  test('unitary whisper', () => {
    // vi.doMock()
    throw new Error('debe mockear openAI')
    // vi.doUnmock()
  })
})
