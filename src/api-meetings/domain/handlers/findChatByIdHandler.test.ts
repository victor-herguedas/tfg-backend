import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { findChatByIdHandler } from './findChatByIdHandler.js'
import { ChatState } from '../models/Chat.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'

describe('findChatByIdHandler', () => {
  const userId = '664bbc255926673e7122649e'
  const chatId = '66620b847bda704c123cda07'
  const meetingId = '665613cf110d408663836770'
  const meetingNotUserOwnerId = '666442d1a6cfe1fb896c5370'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return chat by id', async () => {
    const chat = await findChatByIdHandler(userId, meetingId, chatId)
    expect(chat.id).toBe(chatId)
    expect(chat.meetingId).toBe(meetingId)
    expect(chat.chatState).toBe(ChatState.WAITING)
  })

  test('should return Mising File error', async () => {
    await expect(findChatByIdHandler(userId, meetingId, 'noID')).rejects.toThrow(NotFoundError)
  })

  test('should return unauthorized error if not chatId owner', async () => {
    await expect(findChatByIdHandler(userId, meetingNotUserOwnerId, chatId)).rejects.toThrow(UnautorizedError)
  })

  test('should return unauthorized error if not meeting owner', async () => {
    await expect(findChatByIdHandler('noID', meetingId, chatId)).rejects.toThrow(UnautorizedError)
  })
})
