import { type CreateChatDto } from '../../adapters/primary/dtos/createChatDto.js'
import { createChat, updateChatConversations } from '../../adapters/secondary/repository/ChatRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { type Chat } from '../models/Chat.js'
import { generateChatResponse } from '../services/chatGptService.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'

export const createChatHandler = async (userId: string, createChatDto: CreateChatDto): Promise<Chat> => {
  const { meetingId, message } = createChatDto
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('meeting ' + meetingId))
  if (meeting.transcription === null) throw new NotFoundError(getNotFoundErrorMessage('Transcription of Meeting' + meetingId))
  console.log(0)
  const chat = await createChat(meeting, message)
  console.log(1)
  const chatResponse = await generateChatResponse(chat.messages)
  console.log(2)
  const chatWithResponse = await updateChatConversations(chat.id, 'system', chatResponse)
  console.log(3)
  console.log(chatWithResponse)
  return chatWithResponse
}
