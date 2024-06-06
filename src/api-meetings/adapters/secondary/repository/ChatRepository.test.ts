import { beforeEach, describe, expect, test, vi } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { findMeetingById } from './MeetingsRepository.js'
import { createChat, findChatById, findChatsByMeetingId, updateChatConversations } from './ChatRepository.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'

describe('createChatHandler', () => {
  const meetingId: string = '664bbc255926673e7122649f'
  const chatId = '66620b847bda704c123cda07'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should throw a database error if a message does not exist', async () => {
    const meeting = await findMeetingById(meetingId) as unknown as Meeting
    await expect(createChat(meeting, '')).rejects.toThrow(DatabaseError)
  })

  test('should return empty list when meetingId incorrect when searching chats', async () => {
    const chats = await findChatsByMeetingId('wrong')
    expect(chats.toString()).toBe([].toString())
  })

  test('should return null if chatId does not exist', async () => {
    const chat = await findChatById('wrong')
    expect(chat).toBeNull()
  })

  test('should update chat updatedAt ', async () => {
    const date = new Date(2022, 1, 1)
    vi.useFakeTimers()
    vi.setSystemTime(date)
    const updatedChat = await updateChatConversations(chatId, 'user', 'hello')
    vi.useRealTimers()
    expect(updatedChat.updatedAt.toString()).toBe(date.toString())
  })
})
