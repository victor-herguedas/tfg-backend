import { ActionAlreadyRunningError, getActionAlreadyRunningErrorMessage } from '../../../utilities/errors/ActionAlreadyRuningError/ActionAlredyRunningError.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { type AddChatQuestionDto as AddChatQuestionDTO } from '../../adapters/primary/dtos/addChatQuestionDTO.js'
import { addChatConversations, updateChatState } from '../../adapters/secondary/repository/ChatsRepository.js'
import { findChatByIdSecured } from '../../adapters/secondary/repository/ChatsSecuredRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { ChatState, type Chat } from '../models/Chat.js'
import { generateAIChatResponseService } from '../services/chatGptService.js'

export const addChatQuestionHandler = async (userId: string, addChatQuestionDTO: AddChatQuestionDTO): Promise<Chat> => {
  const meeting = await findMeetingByIdSecured(addChatQuestionDTO.meetingId, userId)
  if (meeting == null) throw new NotFoundError(getNotFoundErrorMessage(`Meeting with ${addChatQuestionDTO.meetingId} not found`))
  const chat = await getChatValidated(addChatQuestionDTO.chatId, addChatQuestionDTO.meetingId)
  const chatResponse = await getChatResponse(chat)
  const chatWithResponse = await addAndSaveResponseToChat(chat.id, addChatQuestionDTO.question, chatResponse)
  return chatWithResponse
}

export const getChatValidated = async (chatId: string, meetingId: string): Promise<Chat> => {
  let chat = await findChatByIdSecured(chatId, meetingId)
  if (chat == null) throw new NotFoundError(getNotFoundErrorMessage(`Chat with ${chatId} not found`))
  if (chat.chatState === 'IN_PROGRESS') throw new ActionAlreadyRunningError(getActionAlreadyRunningErrorMessage('Chat ' + chatId))
  chat = await updateChatState(chat.id, ChatState.IN_PROGRESS)
  return chat
}

export const getChatResponse = async (chat: Chat): Promise<string> => {
  try {
    const response = await generateAIChatResponseService(chat.messages)
    return response
  } catch (error: any) {
    await updateChatState(chat.id, ChatState.FAILED)
    throw new OpenAiApiError('OpenAi api fails generating a response for the chat')
  }
}

export const addAndSaveResponseToChat = async (chatId: string, question: string, chatBotResponse: string): Promise<Chat> => {
  const messages = [
    { role: 'user', text: question },
    { role: 'system', text: chatBotResponse }
  ]
  const chat = await addChatConversations(chatId, messages)
  return chat
}
