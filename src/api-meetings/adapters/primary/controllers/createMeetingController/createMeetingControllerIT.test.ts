import { describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../../index.js'
import { MEDIA_PATH } from '../../../../../utilities/environment.js'
import path from 'path'

const testFilesRoute = path.join(MEDIA_PATH, 'test-media')

describe('createMeetingControllerIT.test.ts', () => {
  test('should return a 202 ok accepted and the id of the meeting', async () => {
    const res = await req(app)
      .post('/meetings')
      .type('form')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))
      .field('name', 'Kickoff meeting')
      .field('date', '2021-01-01')

    expect(res.status).toBe(202)
    expect(res.body.id).toBeDefined()
  })

  test('should fail if not audio file sended', async () => {
    const res = await req(app)
      .post('/meetings')
      .send({})
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
})
