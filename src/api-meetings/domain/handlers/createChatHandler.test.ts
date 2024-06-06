import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { getChatDtoMother } from '../../test/CreateChatDtoMother.js'
import { createChatHandler, createChatWithResponse, createInitialChat } from './createChatHandler.js'
import { findMeetingById } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { MEETING_CHAT_PROMPT } from '../../../utilities/environment.js'
import { findChatsByMeetingId } from '../../adapters/secondary/repository/ChatRepository.js'
import { type Meeting } from '../models/Meeting.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'

describe('createChatHandler', () => {
  const meetingId: string = '665613cf110d408663836770'
  const userId: string = '664bbc255926673e7122649e'
  const userWithoutMeetingsId: string = '6651a929c99b6216df26fca0'
  const meetingWithouTranscriptionId: string = '664bbc255926673e7122649f'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should create a chat', async () => {
    const meeting = await findMeetingById(meetingId) as unknown as Meeting
    const chatDto = getChatDtoMother({ meetingId })
    const chat = await createChatHandler(userId, chatDto)
    expect(chat).toBeDefined()
    expect(chat.messages.length > 1).toBeTruthy()

    expect(chat.messages[0].role).toBe('system')
    expect(chat.messages[0].text).toBe(MEETING_CHAT_PROMPT)

    expect(chat.messages[1].role).toBe('system')
    expect(chat.messages[1].text).toBe(meeting?.transcription)

    expect(chat.messages[2].role).toBe('user')

    const chats = await findChatsByMeetingId(meeting.id)
    const chatFound = chats.find(c => c.id.toString() === chat.id.toString())
    expect(chatFound?.meetingId.toString()).toBe(meeting.id.toString())
    expect(chatFound?.id.toString()).toBe(chat.id.toString())
  })

  test('chats should have correct states', async () => {
    const meeting = await findMeetingById(meetingId) as unknown as Meeting
    const chat = await createInitialChat(meeting, 'hello')
    expect(chat.chatState).toBe('IN_PROGRESS')

    const secondChat = await createChatWithResponse(chat.id, 'response')
    expect(secondChat.chatState).toBe('WAITING')
  })

  test('should throw exception if the meeting does not have transcription', async () => {
    const chatDto = getChatDtoMother({ meetingId: meetingWithouTranscriptionId })
    await expect(createChatHandler(userId, chatDto)).rejects.toThrow(NotFoundError)
  })

  test('should throw exception if the meeting does not exist', async () => {
    const chatDto = getChatDtoMother({ meetingId: '66609adbb2dd3bdb39e17045' })
    await expect(createChatHandler(userId, chatDto)).rejects.toThrow(NotFoundError)
  })

  test('should throw exception if the meeting is yours', async () => {
    const chatDto = getChatDtoMother({ meetingId })
    await expect(createChatHandler(userWithoutMeetingsId, chatDto)).rejects.toThrow(UnautorizedError)
  })
})
