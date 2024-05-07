import { describe, expect, test, vi } from 'vitest'
import { whisperTranscribe } from './whisperService.js'
import path from 'path'
import { MEDIA_PATH } from '../../../utilities/environment.js'

vi.mock('../../../utilities/openAI/openAi.js', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('../../../utilities/environment.js')>()
  return {
    ...mod,
    openAiSession: {
      audio: {
        transcriptions: {
          create: vi.fn(() => {
            return (
              { text: 'pruebapruebita' }
            )
          })
        }
      }
    }
  }
})

describe('whisper openAi api it', () => {
  test('unitary whisper', async () => {
    const transcription = await whisperTranscribe(path.join(MEDIA_PATH, 'test-media', 'test.mp3'))
    expect(transcription).toContain('pruebapruebita')
    vi.doUnmock('../../../utilities/openAI/openAi.js')
  })
})
