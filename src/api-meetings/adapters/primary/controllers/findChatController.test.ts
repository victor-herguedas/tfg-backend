import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import app from '../../../../index.js'
import req from 'supertest'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { type Chat, ChatState } from '../../../domain/models/Chat.js'

// Devolver cuando una de las dos no exista un 404

describe('findChatController', () => {
//   const userId = '664bbc255926673e7122649e'
  const token = getUserTokenMother()
  const meetingId = '665613cf110d408663836770'
  const chatId = '66620b847bda704c123cda07'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a chat', async () => {
    const res = await req(app)
      .get(`/meetings/${meetingId}/chats/${chatId}`)
      .set('Cookie', `JWT=${token}`)

    expect(res.status).toBe(200)

    const chat: Chat = res.body.chat as unknown as Chat
    expect(chat).toBeDefined()
    expect(chat.id).toBe(chatId)
    expect(chat.meetingId).toBe(meetingId)
    expect(chat.chatState).toBe(ChatState.WAITING)
    expect(chat.messages.length >= 3).toBe(true)
  })

  test('should return 401 if not autenticated', async () => {
    const res = await req(app)
      .get(`/meetings/${meetingId}/chats/${chatId}`)

    expect(res.status).toBe(401)
  })

  test('should return 404 if chat not found', async () => {
    const res = await req(app)
      .get(`/meetings/${meetingId}/chats/-1`)
      .set('Cookie', `JWT=${token}`)

    expect(res.status).toBe(404)
  })
})
