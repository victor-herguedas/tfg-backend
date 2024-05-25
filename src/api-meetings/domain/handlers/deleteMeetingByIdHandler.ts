import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { deleteMeetingById } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'

export const deleteMeetingByIdHandler = async (meetingId: string, userId: string): Promise<void> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('meeting: ' + meetingId))
  await deleteMeetingById(meetingId)
}
