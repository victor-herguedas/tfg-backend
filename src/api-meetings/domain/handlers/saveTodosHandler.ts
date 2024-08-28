import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { type SaveTodosDTO } from '../../adapters/primary/dtos/saveTodosDTO.js'
import { updateMeeting } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'

export const saveTodosHandler = async (saveTodosDTO: SaveTodosDTO, userId: string): Promise<void> => {
  const meeting = await findMeetingByIdSecured(saveTodosDTO.meetingId, userId)
  if (meeting === null) throw new NotFoundError(`Meeting ${saveTodosDTO.meetingId} not found`)
  meeting.todos = saveTodosDTO.todos
  await updateMeeting(meeting)
}
