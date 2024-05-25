import { findMeetingsByUserId } from '../../adapters/secondary/daoAdapters/MeetingDaoAdapter.js'
import { type Meeting } from '../models/Meeting.js'

export const findMeetingsHandler = async (userId: string): Promise<Meeting[]> => {
  const meetigns = await findMeetingsByUserId(userId)
  return meetigns
}
