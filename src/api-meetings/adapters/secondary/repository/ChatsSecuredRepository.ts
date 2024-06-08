import { UnautorizedError } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type Chat } from '../../../domain/models/Chat.js'
import { findChatById } from './ChatsRepository.js'

export const findChatByIdSecured = async (chatId: string, meetingId: string): Promise<Chat | null> => {
  const chat = await findChatById(chatId)
  if (chat === null) return null
  if (chat.meetingId.toString() !== meetingId) throw new UnautorizedError()
  return chat
}
