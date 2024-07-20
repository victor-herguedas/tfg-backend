import { ActionAlreadyRunningError, getActionAlreadyRunningErrorMessage } from '../../../utilities/errors/ActionAlreadyRuningError/ActionAlredyRunningError.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { type AddChatQuestionDto as AddChatQuestionDTO } from '../../adapters/primary/dtos/addChatQuestionDTO.js'
import { updateChat, updateChatState } from '../../adapters/secondary/repository/ChatsRepository.js'
import { findChatByIdSecured } from '../../adapters/secondary/repository/ChatsSecuredRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { ChatState, type Message, type Chat } from '../models/Chat.js'
import { generateAIChatResponseService } from '../services/chatGptService.js'

export const addChatQuestionHandler = async (userId: string, addChatQuestionDTO: AddChatQuestionDTO): Promise<Chat> => {
  await checkChatMeetingExistAndUserPerms(addChatQuestionDTO.meetingId, userId)
  let chat = await getChat(addChatQuestionDTO.chatId, addChatQuestionDTO.meetingId)
  chat = await updateChatStatusToInProgress(chat)
  chat = addQuestionToTheChat(chat, addChatQuestionDTO.question)
  const chatResponse = await getQuestionResponse(chat, addChatQuestionDTO.question)
  chat = await addResponseToChat(chat, chatResponse)
  chat = await updateChatStateToWaiting(chat)
  chat = await saveChat(chat)
  return chat
}

const checkChatMeetingExistAndUserPerms = async (meetingId: string, userId: string): Promise<void> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting == null) throw new NotFoundError(getNotFoundErrorMessage(`Meeting with ${meetingId} not found`))
}

export const getChat = async (chatId: string, meetingId: string): Promise<Chat> => {
  const chat = await findChatByIdSecured(chatId, meetingId)
  if (chat == null) throw new NotFoundError(getNotFoundErrorMessage(`Chat with ${chatId} not found`))
  return chat
}

const addQuestionToTheChat = (chat: Chat, question: string): Chat => {
  const newQuestion: Message = { role: 'user', text: question, createdAt: new Date() }
  chat.messages.push(newQuestion)
  return chat
}

const addResponseToChat = async (chat: Chat, response: string): Promise<Chat> => {
  const newResponse: Message = { role: 'system', text: response, createdAt: new Date() }
  chat.messages.push(newResponse)
  return chat
}

export const updateChatStatusToInProgress = async (chat: Chat): Promise<Chat> => {
  if (chat.chatState === 'IN_PROGRESS') throw new ActionAlreadyRunningError(getActionAlreadyRunningErrorMessage('Chat ' + chat.id))
  chat = await updateChatState(chat.id, ChatState.IN_PROGRESS)
  return chat
}

const updateChatStateToWaiting = async (chat: Chat): Promise<Chat> => {
  chat.chatState = ChatState.WAITING
  return chat
}

export const getQuestionResponse = async (chat: Chat, question: string): Promise<string> => {
  try {
    const response = await generateAIChatResponseService(chat.messages)
    return response
  } catch (error: any) {
    await updateChatState(chat.id, ChatState.FAILED)
    throw new OpenAiApiError('OpenAi api fails generating a response for the chat')
  }
}

const saveChat = async (chat: Chat): Promise<Chat> => {
  return await updateChat(chat)
}
