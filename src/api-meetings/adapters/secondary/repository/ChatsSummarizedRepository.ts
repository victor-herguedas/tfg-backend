import { type ChatSummary } from '../../../domain/models/ChatSummary.js'
import { isValidObjectId } from 'mongoose'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { ChatEntity } from '../entities/ChatEntity.js'

export const findChatsSummarizedByMeetingId = async (meetingId: string): Promise<ChatSummary[]> => {
  try {
    if (!isValidObjectId(meetingId)) throw new DatabaseError(`Meeting with ${meetingId} not found`)
    const chats = await ChatEntity.find({ meetingId })
    return chats.map(chat => chat.toChatSummary())
  } catch (error: any) {
    throw new DatabaseError(error.message as unknown as string)
  }
}
