import { mongodbConnection } from '../mongodb/mongodb.js'
import { UserEntity } from '../../api-auth/adapters/secundary/enitties/UserEntity.js'
import { generateSalt, hashPassword } from '../../api-auth/domain/services/securityService/securityService.js'
import { MeetingEntity } from '../../api-meetings/adapters/secondary/entities/MeetingEntity.js'
import { SummaryState, TranscriptionState } from '../../api-meetings/domain/models/Meeting.js'
import mongoose from 'mongoose'

export const restartDatabase = async (): Promise<void> => {
  const collections = await mongodbConnection.db?.listCollections()?.toArray()
  if (collections !== undefined) {
    for (const collection of collections) {
      await mongodbConnection.db.collection(collection.name).deleteMany({})
    }
  }
  await populate()
}

const populate = async (): Promise<void> => {
  const userSalt = generateSalt()
  const userPassword = '12345678'
  const user1 = await new UserEntity({
    _id: new mongoose.Types.ObjectId('664bbc255926673e7122649e'),
    email: 'exist@test.com',
    salt: userSalt,
    password: hashPassword(userPassword, userSalt),
    name: 'exist',
    rols: []
  }).save()

  await new UserEntity({
    _id: new mongoose.Types.ObjectId('6651a929c99b6216df26fca0'),
    email: 'notMeetings@test.com',
    salt: userSalt,
    password: hashPassword(userPassword, userSalt),
    name: 'No Meetings',
    rols: []
  }).save()

  await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('664bbc255926673e7122649f'),
    userId: user1._id,
    name: 'Welcome Meeting',
    transcription: null,
    transcriptionState: TranscriptionState.IN_PROGRESS,
    summaryState: SummaryState.WAITING,
    meetingDate: new Date('2002-06-22'),
    createdAt: new Date('2002-06-22')
  }).save()

  await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('665613cf110d408663836770'),
    userId: user1._id,
    name: 'Welcome Meeting',
    transcription: 'This is a transcription',
    transcriptionState: TranscriptionState.COMPLETED,
    summaryState: SummaryState.WAITING,
    meetingDate: new Date('2002-06-22'),
    createdAt: new Date('2002-06-22')
  }).save()
}
