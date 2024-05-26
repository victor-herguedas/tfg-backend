import { describe, expect, test } from 'vitest'
import path from 'path'
import { MEDIA_PATH, PAID_TEST } from '../../../utilities/environment.js'
import { whisperTranscribe } from './whisperService.js'

describe('whisper openAi api', () => {
  test('integration whisper', async () => {
    if (PAID_TEST) {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('talento')
    } else {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('This is a placeholder for the paid test.')
    }
  })
})
