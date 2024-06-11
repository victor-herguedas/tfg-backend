import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

const token = getUserTokenMother()

describe('createChatControllerIT', () => {
  beforeEach(async () => {
    await restartDatabase()
  })
  test('should create a chat', async () => {
    const meetingId = '665613cf110d408663836770'
    const res = await req(app)
      .post(`/meetings/${meetingId}/chats`)
      .set('Cookie', `JWT=${token}`)
      .send({
        message: '¿Qué es lo mas importante de la reunión?'
      })

    expect(res.status).toBe(202)
  })

  test('should return 401 unauthorized when no token is provided', async () => {
    const res = await req(app)
      .post('/meetings/1/chats')

    expect(res.status).toBe(401)
  })

  test('should return 400 if not corret body', async () => {
    const res = await req(app)
      .post('/meetings/1/chats')
      .set('Cookie', `JWT=${token}`)
      .send({
        random: 'random'
      })

    expect(res.status).toBe(400)
  })
})
