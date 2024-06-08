import { type CreateChatDto } from '../../adapters/primary/dtos/createChatDto.js'
import { createChat, addChatConversation } from '../../adapters/secondary/repository/ChatsRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { type Chat } from '../models/Chat.js'
import { generateAIChatResponseService } from '../services/chatGptService.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { type Meeting } from '../models/Meeting.js'

export const createChatHandler = async (userId: string, createChatDto: CreateChatDto): Promise<Chat> => {
  const { meetingId, message } = createChatDto
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('meeting ' + meetingId))
  if (meeting.transcription === null) throw new NotFoundError(getNotFoundErrorMessage('Transcription of Meeting' + meetingId))
  const chat = await createInitialChat(meeting, message)
  const chatResponse = await generateAIChatResponseService(chat.messages)
  const chatWithResponse = await addAndSaveResponseToChat(chat.id, chatResponse)
  return chatWithResponse
}

export const createInitialChat = async (meeting: Meeting, message: string): Promise<Chat> => {
  return await createChat(meeting, message)
}

export const addAndSaveResponseToChat = async (chatId: string, chatBotResponse: string): Promise<Chat> => {
  return await addChatConversation(chatId, 'system', chatBotResponse)
}
