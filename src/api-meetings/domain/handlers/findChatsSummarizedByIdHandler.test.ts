import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { findChatsSummarizedHandler } from './findChatsSummarizedByIdHandler.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'

describe('findChatByIdHandler', () => {
  const userId = '664bbc255926673e7122649e'
  const meetingId = '665613cf110d408663836770'
  const meetingNotUserOwnerId = '666442d1a6cfe1fb896c5370'
  const meetingWithNoChats = '664bbc255926673e7122649f'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return chats summarized by id', async () => {
    const chats = await findChatsSummarizedHandler(userId, meetingId)
    expect(chats.length > 1).toBeTruthy()
    const chatSummary = chats[0]
    const chat = chatSummary as unknown as any
    expect(chat.messages == null).toBeTruthy()
  })

  test('should return empty list', async () => {
    const chats = await findChatsSummarizedHandler(userId, meetingWithNoChats)
    console.log(chats)
    expect(chats.length === 0).toBeTruthy()
  })

  test('should return meeting not found', async () => {
    await expect(findChatsSummarizedHandler(userId, 'NoMeeting')).rejects.toThrow(NotFoundError)
  })

  test('should return unauthorized error if not meeting owner', async () => {
    await expect(findChatsSummarizedHandler(userId, meetingNotUserOwnerId)).rejects.toThrow(UnautorizedError)
  })
})
