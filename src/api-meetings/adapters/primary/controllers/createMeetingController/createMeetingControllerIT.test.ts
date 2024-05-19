import { describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../../index.js'
import { MEDIA_PATH } from '../../../../../utilities/environment.js'
import path from 'path'

const testFilesRoute = path.join(MEDIA_PATH, 'test-media')

describe('createMeetingControllerIT.test.ts', () => {
  test.todo('should return a 202 ok accepted and the id of the meeting', async () => {
    const res = await req(app)
      .post('/meetings')

    expect(res.status).toBe(202)
  })

  test.todo('should return 202 ok if correct meeting payload', () => {
    // .attach('audio', path.join(testFilesRoute, 'test.mp3'))

  })

  test('should fail if not audio file sended', async () => {
    const res = await req(app)
      .post('/meetings')
      .send({})
    console.log(res.body)
    expect(res.status).toBe(400)
    expect(res.body.type).toBe('ValidationError')
  })

  test('should fail if not correct meeting payload', async () => {
    const res = await req(app)
      .post('/meetings')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))
    expect(res.status).toBe(400)
    expect(res.body.type).toBe('ValidationError')
  })

  test.todo('should fail if not correct autentiaction', () => {

  })

  // Comprobar autenticación
})

// Comprobar que ha guardado la meeting
// Comprobar que se ha empezado a transcribir el texto
// Comprobar que se ha enviado la transcripción a whispper
// Comprobar que se ha almacenado la transcripción en la base de datos
