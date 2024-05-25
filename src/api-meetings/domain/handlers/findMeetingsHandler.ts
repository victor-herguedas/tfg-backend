import { findMeetingsByUserId } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { type Meeting } from '../models/Meeting.js'

export const findMeetingsHandler = async (userId: string): Promise<Meeting[]> => {
  const meetigns = await findMeetingsByUserId(userId)
  return meetigns
}
