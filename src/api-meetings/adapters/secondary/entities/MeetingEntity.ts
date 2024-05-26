import mongoose, { type ObjectId } from 'mongoose'
import { mongodbConnection } from '../../../../utilities/mongodb/mongodb.js'
import { Meeting, type SummaryState, type TranscriptionState } from '../../../domain/models/Meeting.js'

export interface MeetingEntityInterface extends mongoose.Document {
  _id: ObjectId
  userId: ObjectId
  name: string
  transcription: string | null
  transcriptionState: TranscriptionState
  summary: string | null
  summaryState: SummaryState
  summaryCreatedAt: Date | null
  meetingDate: Date
  createdAt: Date

  toMeeting: () => Meeting
}

const meetingEntitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  name: { type: String, required: true },
  transcription: { type: String },
  transcriptionState: { type: String, required: true },
  summary: { type: String },
  summaryState: { type: String },
  summaryCreatedAt: { type: Date },
  meetingDate: { type: Date, required: true },
  createdAt: { type: Date, inmutable: true, default: () => new Date() }
})

meetingEntitySchema.methods.toMeeting = function () {
  const meetingEntity = this as MeetingEntityInterface
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const _id = meetingEntity._id.toString()
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const userId = meetingEntity.userId.toString()

  return new Meeting(
    _id,
    userId,
    meetingEntity.name,
    meetingEntity.transcription,
    meetingEntity.transcriptionState,
    meetingEntity.summary,
    meetingEntity.summaryState,
    meetingEntity.summaryCreatedAt,
    meetingEntity.meetingDate,
    meetingEntity.createdAt
  )
}

export const convertMeetingToMeetingEntity = (meeting: Meeting): MeetingEntityInterface => {
  const meetingEntity = new MeetingEntity({
    _id: new mongoose.Types.ObjectId(meeting.id),
    userId: new mongoose.Types.ObjectId(meeting.userId),
    name: meeting.name,
    transcription: meeting.transcription,
    transcriptionState: meeting.transcriptionState,
    State: meeting.transcriptionState,
    meetingDate: meeting.meetingDate,
    createdAt: meeting.createdAt
  })
  return meetingEntity
}

export const MeetingEntity = mongodbConnection.model<MeetingEntityInterface>('Meeting', meetingEntitySchema)
