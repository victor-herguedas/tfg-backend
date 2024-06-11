import { beforeEach, describe, expect, test, vi } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { getAddChatQuestionDtoMother } from '../../test/AddChatQuestionDtoMother.js'
import { addChatQuestionHandler, getChatValidated } from './addChatQuestionHandler.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { ActionAlreadyRunningError } from '../../../utilities/errors/ActionAlreadyRuningError/ActionAlredyRunningError.js'
import { findChatById } from '../../adapters/secondary/repository/ChatsRepository.js'
import { ChatState, type Chat } from '../models/Chat.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'

const mocks = vi.hoisted(() => {
  return {
    mock: vi.fn()
  }
})

vi.mock('../services/chatGptService.js', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('../../../utilities/environment.js')>()
  return {
    ...mod,
    generateAIChatResponseService: mocks.mock.mockImplementation(() => { return 'This is a placeholder for the paid test.' })
  }
})

// Si el chatbot da error el waiting se pone en error

describe('addChatQuestionHandler', () => {
  const userId = '664bbc255926673e7122649e'
  const meetingNotUserOwnerId = '666442d1a6cfe1fb896c5370'

  const chatId = '66620b847bda704c123cda07'
  const meetingId = '665613cf110d408663836770'

  const meetingNoChatId = '664bbc255926673e7122649f'
  const chatInPrgressId = '66642ff1440be060eaee5ff3'

  beforeEach(async () => {
    await restartDatabase()
    mocks.mock.mockClear()
  })

  test('should return a chat with an answer', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({})
    const chat = await addChatQuestionHandler(userId, addChatQuestionDTO)

    const messages = chat.messages

    console.log(messages.length)
    expect(messages.length >= 6).toBeTruthy()
    expect(messages[5].role).toBe('system')
    expect(messages[4].role).toBe('user')
    expect(messages[4].text).toBe(addChatQuestionDTO.question)
    expect(chat).toBeDefined()

    expect(chat.chatState).toBe(ChatState.WAITING)
    const findedChat = await findChatById(chatId) as unknown as Chat
    expect(findedChat.chatState).toBe(ChatState.WAITING)
  })

  test('should return NotFoundError if the meeting does not exist', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({ meetingId: '1' })
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(NotFoundError)
  })

  test(' should return NotFoundError if the chat does not exist', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({ chatId: '1' })
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(NotFoundError)
  })

  test('should throw unauthorized error if the user is not the owner of the meeting', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({ meetingId: meetingNotUserOwnerId })
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(UnautorizedError)
  })

  test('should throw unauthorized error if the chat is notof the meeting', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({ chatId, meetingId: meetingNoChatId })
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(UnautorizedError)
  })

  test('should throw unauthorized error if the chat is notof the meeting', async () => {
    const addChatQuestionDTO = getAddChatQuestionDtoMother({ chatId: chatInPrgressId })
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(ActionAlreadyRunningError)
  })

  test('chat must be in progress when it starts', async () => {
    const chatStarted = await getChatValidated(chatId, meetingId)
    expect(chatStarted.chatState).toBe(ChatState.IN_PROGRESS)

    const findedChat = await findChatById(chatId) as unknown as Chat
    expect(findedChat.chatState).toBe(ChatState.IN_PROGRESS)
  })

  test('Should update the chat to waiting and Error when the transcription fails', async () => {
    mocks.mock.mockImplementation(() => { throw new Error('Error') })
    const addChatQuestionDTO = getAddChatQuestionDtoMother({})
    await expect(addChatQuestionHandler(userId, addChatQuestionDTO)).rejects.toThrow(OpenAiApiError)

    const findedChat = await findChatById(addChatQuestionDTO.chatId) as unknown as Chat
    expect(findedChat.chatState).toBe(ChatState.FAILED)
  })

  test('if the meeting is not of the chat should throw an error', async () => {
    await expect(getChatValidated(chatId, meetingNoChatId)).rejects.toThrow(UnautorizedError)
  })
})
