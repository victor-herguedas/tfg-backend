import { UnautorizedError } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { findMeetingById } from './MeetingsRepository.js'

export const findMeetingByIdSecured = async (meetingId: string, userId: string): Promise<Meeting | null> => {
  const meeting = await findMeetingById(meetingId)
  if (meeting === null) return null
  if (meeting.userId.toString() !== userId) throw new UnautorizedError()
  return meeting
}
