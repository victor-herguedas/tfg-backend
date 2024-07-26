import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { MEDIA_PATH } from '../../../../utilities/environment.js'
import path from 'path'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

const testFilesRoute = path.join(MEDIA_PATH, 'test-media')
const authToken = getUserTokenMother()

describe('createMeetingControllerIT.test.ts', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a meeting', async () => {
    const res = await req(app)
      .post('/meetings')
      .set('Cookie', `JWT=${authToken}`)
      .type('form')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))
      .field({
        name: 'test',
        date: '2021-01-01'
      })

    expect(res.status).toBe(202)
    expect(res.body.id).toBeDefined()
  })

  test('should fail if not audio file sended', async () => {
    const res = await req(app)
      .post('/meetings')
      .set('Cookie', `JWT=${authToken}`)
      .send({})
    expect(res.status).toBe(400)
    expect(res.body.type).toBe('ValidationError')
  })

  test('should fail if not correct meeting payload', async () => {
    const res = await req(app)
      .post('/meetings')
      .set('Cookie', `JWT=${authToken}`)
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))
    expect(res.status).toBe(400)
    expect(res.body.type).toBe('ValidationError')
  })

  test('should fail if not correct autentiaction', async () => {
    const res = await req(app)
      .post('/meetings')
      .type('form')
      .attach('audio', path.join(testFilesRoute, 'test.mp3'))
      .field({
        name: 'test',
        date: '2021-01-01'
      })

    expect(res.status).toBe(401)
  })
})
