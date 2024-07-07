import mongoose, { isValidObjectId } from 'mongoose'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { SummaryState, TranscriptionState, type Meeting } from '../../../domain/models/Meeting.js'
import { MeetingEntity, convertMeetingToMeetingEntity } from '../entities/MeetingEntity.js'

export const saveMeeting = async (name: string, meetingDate: Date, userId: string): Promise<Meeting> => {
  try {
    const meetingEntity = await new MeetingEntity({
      name,
      userId: new mongoose.Types.ObjectId(userId),
      transcription: null,
      transcriptionState: TranscriptionState.IN_PROGRESS,
      summaryState: SummaryState.WAITING,
      shortDescriptionState: SummaryState.WAITING,
      imageState: SummaryState.WAITING,
      meetingDate
    }).save()
    return await meetingEntity.toMeeting()
  } catch (error) {
    throw new DatabaseError()
  }
}

export const findMeetingById = async (id: string): Promise<Meeting | null> => {
  try {
    if (!isValidObjectId(id)) return null
    const meetingEntity = await MeetingEntity.findById(id)
    const meeting = await meetingEntity?.toMeeting()
    return meeting ?? null
  } catch (error) {
    throw new DatabaseError()
  }
}

interface FindMeetingsByUserIdProps {
  name?: string
}

export const findMeetingsByUserId = async (userId: string, filters?: FindMeetingsByUserIdProps): Promise<Meeting[]> => {
  try {
    if (!isValidObjectId(userId)) return []
    if (filters?.name === undefined) {
      const meetingsEntities = await MeetingEntity.find({ userId: new mongoose.Types.ObjectId(userId) })
      const meetings = await Promise.all(meetingsEntities.map(async (meetingEntity) => await meetingEntity.toMeeting()))
      return meetings
    } else {
      const meetingsEntities = await MeetingEntity.find({ userId: new mongoose.Types.ObjectId(userId), name: { $regex: filters.name, $options: 'i' } })
      const meetings = await Promise.all(meetingsEntities.map(async (meetingEntity) => await meetingEntity.toMeeting()))
      return meetings
    }
  } catch (error) {
    throw new DatabaseError()
  }
}

export const updateMeeting = async (meeting: Meeting): Promise<Meeting> => {
  try {
    const meetingEntity = convertMeetingToMeetingEntity(meeting)
    meetingEntity.isNew = false
    await meetingEntity.save()
    return await meetingEntity.toMeeting()
  } catch (error) {
    throw new DatabaseError()
  }
}

export const deleteMeetingById = async (id: string): Promise<void> => {
  try {
    await MeetingEntity.findByIdAndDelete(id)
  } catch (error) {
    throw new DatabaseError()
  }
}
