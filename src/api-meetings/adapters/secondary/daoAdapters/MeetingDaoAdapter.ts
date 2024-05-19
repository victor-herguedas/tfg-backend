import mongoose from 'mongoose'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { MeetingEntity } from '../entities/MeetingEntity.js'

export const saveMeeting = async (name: string, meetingDate: Date, userId: string): Promise<Meeting> => {
  try {
    const meetingEntity = await new MeetingEntity({
      name,
      userId: new mongoose.Types.ObjectId(userId),
      transcription: null,
      transcriptionState: 'IN_PROGRESS',
      meetingDate
    }).save()
    return meetingEntity.toMeeting()
  } catch (error) {
    throw new DatabaseError()
  }
}

export const findMeetingById = async (id: string): Promise<Meeting | null> => {
  try {
    const meetingEntity = await MeetingEntity.findById(id)
    const meeting = meetingEntity?.toMeeting()
    return meeting ?? null
  } catch (error) {
    throw new DatabaseError()
  }
}
