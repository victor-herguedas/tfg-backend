import { type Meeting } from '../models/Meeting.js'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'

export const findMeetingByIdHandler = async (meetingId: string, userId: string): Promise<Meeting> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('Meeting ' + meetingId))
  return meeting
}
