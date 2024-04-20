import { expect, describe, test } from 'vitest'
import req from 'supertest'
import app from '@/index.js'
import path from 'path'

describe('whisper routes integration test', () => {
  test('POST /whisper should exist', async () => {
    const res = await req(app)
      .post('/whisper')

    expect(res.status !== 404).toBeTruthy()
  })

  test('It should accept mp3 files called audio', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(__dirname, 'test-files', 'test.mp3'))

    expect(res.status).toBe(201)
  })

  test('It should not accept not mp3 files called audio', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('audio', path.join(__dirname, 'test-files', 'test.gif'))

    expect(res.status).toBe(400)
  })

  test('If audio is not send it should fail', async () => {
    const res = await req(app)
      .post('/whisper')

    expect(res.status).toBe(400)
  })

  test('It should not accept files bigger than 25 mb', async () => {
    const res = await req(app)
      .post('/whisper')
      .attach('file', path.join(__dirname, 'test-files', 'long-audio.mp3'))

    expect(res.status).toBe(400)
  })

  // Debe devolver un texto con la transcripción realizada
})
