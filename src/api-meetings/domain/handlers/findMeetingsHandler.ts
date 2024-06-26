import { findMeetingsByUserId } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { type Meeting } from '../models/Meeting.js'

export const findMeetingsHandler = async (userId: string, name: string | undefined): Promise<Meeting[]> => {
  const meetigns = await findMeetingsByUserId(userId, { name })
  return meetigns
}
