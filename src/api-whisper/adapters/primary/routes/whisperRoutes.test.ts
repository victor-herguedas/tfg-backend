/* eslint-disable @typescript-eslint/consistent-type-imports */
import { expect, describe, test, vi } from 'vitest'
import req from 'supertest'
import path from 'path'
import app from '../../../../index.js'
import { MEDIA_PATH } from '../../../../utilities/environment.js'
import { NotSupportedFileTypeErrorType } from '../../../../utilities/errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { NotSupportedFileSizeErrorType } from '../../../../utilities/errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'

vi.mock('../../../domain/services/whisperService.ts', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../../domain/services/whisperService.js')>()
  return {
    ...mod,
    whisperTranscribe: vi.fn(() => 'El chico tiene mucho talento')
  }
}
)

const testFilesRoute = path.join(MEDIA_PATH, 'test-media')

describe('whisper routes integration test', () => {
  test('POST /whisper should exist', async () => {
    const res = await req(app)
      .post('/whisper')

    expect(res.status !== 404).toBeTruthy()
  })

  test('it should accept mp3 files called audio', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))

    expect(res.status).toBe(201)
  })

  test('it should not accept not mp3 files called audio', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(testFilesRoute, 'test.gif'))

    expect(res.status).toBe(400)
    expect(res.body.type).toBe(NotSupportedFileTypeErrorType)
  })

  test('if audio is not send it should fail', async () => {
    const res = await req(app)
      .post('/whisper')

    expect(res.status).toBe(400)
  })

  test('it should not accept files bigger than 25 mb', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(testFilesRoute, 'long-audio.mp3'))

    expect(res.status).toBe(400)
    expect(res.body.type).toBe(NotSupportedFileSizeErrorType)
  })

  test('it should return a test transcribed from whisper', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))

    expect(res.status).toBe(201)
    expect(res.body.transcription).toContain('talento')
  }
  )

  // Debe devolver un socket para esperar a recibir la petición de que se está procesando
})
