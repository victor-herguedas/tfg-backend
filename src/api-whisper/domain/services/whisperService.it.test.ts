import { describe, expect, test } from 'vitest'
import { whisperTranscribe } from './whisperService.js'
import path from 'path'
import { MEDIA_PATH, USE_REAL_AI_API } from '../../../utilities/environment.js'

describe('whisper openAi api', () => {
  test('integration whisper', async () => {
    if (USE_REAL_AI_API) {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('talento')
    }
  })
})
