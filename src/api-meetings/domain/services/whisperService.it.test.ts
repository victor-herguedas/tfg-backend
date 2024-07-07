import { describe, expect, test } from 'vitest'
import path from 'path'
import { MEDIA_PATH, USE_REAL_AI_API } from '../../../utilities/environment.js'
import { whisperTranscribe } from './whisperService.js'
import { generateAIImage } from './chatGptService.js'

describe('whisper openAi api', () => {
  test('integration whisper', async () => {
    if (USE_REAL_AI_API) {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('talento')
    } else {
      const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
      expect(transcription).toContain('This is a placeholder for the paid test.')
    }
  })
})

describe('Image generation', () => {
  test('Should return a image name', async () => {
    const generatedImage = await generateAIImage('This is a test')
    expect(generatedImage).toBeDefined()
  })
})
