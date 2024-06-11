import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { findChatByIdSecured } from '../../adapters/secondary/repository/ChatsSecuredRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { type Chat } from '../models/Chat.js'
export const findChatByIdHandler = async (userId: string, meetingId: string, chatId: string): Promise<Chat> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('Meeting with id ' + meetingId))
  const chat = await findChatByIdSecured(chatId, meeting.id)
  if (chat === null) throw new NotFoundError(getNotFoundErrorMessage('Chat with id ' + chatId))
  return chat
}
