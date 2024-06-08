import { beforeEach, describe, expect, test, vi } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { findMeetingById } from './MeetingsRepository.js'
import { createChat, findChatById, findChatsByMeetingId, addChatConversations } from './ChatsRepository.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { ChatState } from '../../../domain/models/Chat.js'

// Si falla openAI hay que poner un failed

describe('createChatHandler', () => {
  const meetingId: string = '664bbc255926673e7122649f'
  const chatId = '66620b847bda704c123cda07'
  const messages = [
    { role: 'user', text: 'hello', createdAt: null },
    { role: 'system', text: 'godby', createdAt: null }
  ]
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

  test('should add a chats ', async () => {
    const date = new Date(2022, 1, 1)
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const updatedChat = await addChatConversations(chatId, messages)
    const findedMessages = updatedChat.messages.find((message) => {
      return message.text === 'hello' && message.role === 'user'
    })
    vi.useRealTimers()
    expect(updatedChat.updatedAt.toString()).toBe(date.toString())
    expect(findedMessages !== undefined).toBeTruthy()
    expect(updatedChat.chatState).toBe(ChatState.WAITING)
  })
})
