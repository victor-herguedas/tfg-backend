import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { findChatsSummarizedByMeetingId } from '../../adapters/secondary/repository/ChatsSummarizedRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'
import { type ChatSummary } from '../models/ChatSummary.js'

export const findChatsSummarizedHandler = async (userId: string, meetingId: string): Promise<ChatSummary[]> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('Meeting with id ' + meetingId))
  const chats = await findChatsSummarizedByMeetingId(meetingId)
  return chats
}
