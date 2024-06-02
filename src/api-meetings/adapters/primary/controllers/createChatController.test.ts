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
    const res = await req(app)
      .post('/meetings/1/summary/chats')
      .set('Cookie', `JWT=${token}`)
      .send({
        message: 'Hola'
      })

    const body = res.body
    expect(body.chatId).toBeDefined()
    expect(body.createdAt).toBeDefined()
    expect(body.updatedAt).toBeDefined()
    expect(body.meetingId).toBe(1)

    expect(res.status).toBe(202)
  })

  test('should return 401 unauthorized when no token is provided', async () => {
    const res = await req(app)
      .post('/meetings/1/summary/chats')

    expect(res.status).toBe(401)
  })

  test('should return 400 if not corret body', async () => {
    const res = await req(app)
      .post('/meetings/1/summary/chats')
      .set('Cookie', `JWT=${token}`)
      .send({
        random: 'random'
      })

    expect(res.status).toBe(400)
  })
})
