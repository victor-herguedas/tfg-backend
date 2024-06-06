import { type CreateChatDto } from '../../adapters/primary/dtos/createChatDto.js'
import { createChat, updateChatConversations } from '../../adapters/secondary/repository/ChatRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { type Chat } from '../models/Chat.js'
import { generateChatResponse } from '../services/chatGptService.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { type Meeting } from '../models/Meeting.js'

export const createChatHandler = async (userId: string, createChatDto: CreateChatDto): Promise<Chat> => {
  const { meetingId, message } = createChatDto
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('meeting ' + meetingId))
  if (meeting.transcription === null) throw new NotFoundError(getNotFoundErrorMessage('Transcription of Meeting' + meetingId))
  const chat = await createInitialChat(meeting, message)
  const chatResponse = await generateChatResponse(chat.messages)
  const chatWithResponse = await createChatWithResponse(chat.id, chatResponse)
  return chatWithResponse
}

export const createInitialChat = async (meeting: Meeting, message: string): Promise<Chat> => {
  return await createChat(meeting, message)
}

export const createChatWithResponse = async (chatId: string, chatBotResponse: string): Promise<Chat> => {
  return await updateChatConversations(chatId, 'system', chatBotResponse)
}
