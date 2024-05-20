import mongoose, { type ObjectId } from 'mongoose'
import { mongodbConnection } from '../../../../utilities/mongodb/mongodb.js'
import { Meeting, type TranscriptionState } from '../../../domain/models/Meeting.js'

export interface MeetingEntityInterface extends mongoose.Document {
  _id: ObjectId
  userId: ObjectId
  name: string
  transcription: string | null
  transcriptionState: TranscriptionState
  meetingDate: Date
  createdAt: Date

  toMeeting: () => Meeting
}

const meetingEntitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  name: { type: String, required: true },
  transcription: { type: String },
  transcriptionState: { type: String, required: true },
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
    meetingEntity.meetingDate,
    meetingEntity.createdAt
  )
}

// export const convertUserToUserEntity = (meeting: Meeting): MeetingEntityInterface => {
//   const userEntity = new MeetingEntity({
//     email: user.email,
//     salt: user.salt,
//     password: user.password,
//     name: user.name,
//     rols: user.rols
//   })
//   return userEntity
// }

export const MeetingEntity = mongodbConnection.model<MeetingEntityInterface>('Meeting', meetingEntitySchema)
