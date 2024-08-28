import { mongodbConnection } from '../mongodb/mongodb.js'
import { UserEntity } from '../../api-auth/adapters/secundary/enitties/UserEntity.js'
import { generateSalt, hashPassword } from '../../api-auth/domain/services/securityService/securityService.js'
import { MeetingEntity } from '../../api-meetings/adapters/secondary/entities/MeetingEntity.js'
import { ImageState, SummaryState, TodosState, TranscriptionState } from '../../api-meetings/domain/models/Meeting.js'
import mongoose from 'mongoose'
import { ChatState } from '../../api-meetings/domain/models/Chat.js'
import { ChatEntity } from '../../api-meetings/adapters/secondary/entities/ChatEntity.js'
import { MEETING_CHAT_PROMPT } from '../environment.js'

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
    todosState: TodosState.WAITING,
    meetingDate: new Date('2002-06-22'),
    summaryState: SummaryState.WAITING,
    imageState: ImageState.WAITING,
    createdAt: new Date('2002-06-22')
  }).save()

  const meeting2 = await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('665613cf110d408663836770'),
    userId: user1._id,
    name: 'Victor Welcome Meeting',
    transcription: 'This is a transcription',
    transcriptionState: TranscriptionState.COMPLETED,
    todosState: TodosState.WAITING,
    meetingDate: new Date('2002-06-22'),
    summaryState: SummaryState.WAITING,
    imageState: ImageState.WAITING,
    createdAt: new Date('2002-06-22')
  }).save()

  // Meeting without summary
  await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('666442d1a6cfe1fb896c5370'),
    userId: new mongoose.Types.ObjectId('666442be74edcabb94471753'),
    name: 'Meeting of victor',
    transcription: 'This is a transcription',
    transcriptionState: TranscriptionState.COMPLETED,
    summaryState: SummaryState.WAITING,
    imageState: ImageState.WAITING,
    todosState: TodosState.WAITING,
    meetingDate: new Date('2002-06-22'),
    createdAt: new Date('2002-06-22')
  }).save()

  // Meeting without Image
  await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('668ae4748488426e8ce25714'),
    userId: user1._id,
    name: 'Meeting of victor',
    transcription: 'This is a transcription',
    transcriptionState: TranscriptionState.COMPLETED,
    summary: 'This is a short description',
    summaryState: SummaryState.COMPLETED,
    summaryCreatedAt: new Date('2002-06-24'),
    imageName: null,
    imageUrl: null,
    imageState: ImageState.WAITING,
    imageCreatedAt: null,
    todosState: TodosState.WAITING,
    meetingDate: new Date('2002-06-22'),
    createdAt: new Date('2002-06-22')
  }).save()

  // Meeting with todos
  await new MeetingEntity({
    _id: new mongoose.Types.ObjectId('66cecb3e0cdccf15165cce32'),
    userId: user1._id,
    name: 'Meeting with todos',
    transcription: 'This is a transcription',
    transcriptionState: TranscriptionState.COMPLETED,
    summary: 'This is a short description',
    summaryState: SummaryState.COMPLETED,
    summaryCreatedAt: new Date('2002-06-24'),
    imageName: null,
    imageUrl: null,
    imageState: ImageState.COMPLETED,
    imageCreatedAt: null,
    todosState: TodosState.COMPLETED,
    todos: [
      {
        id: '66cf6e7d34251e0764139799',
        todo: 'Investigar las causas del calentamiento global',
        done: false
      },
      {
        id: '66cf6e86f765d75207756ddd',
        todo: 'Revisar datos de temperatura y dióxido de carbono de los últimos 150 años',
        done: false
      },
      {
        id: '66cf6e91126ce3cfd34323ed',
        todo: 'Ampliar la ventana temporal en los estudios de temperatura y dióxido de carbono',
        done: false
      }
    ],
    meetingDate: new Date('2002-06-22'),
    createdAt: new Date('2002-06-22')
  }).save()

  const chatId = '66620b847bda704c123cda07'
  await new ChatEntity({
    _id: new mongoose.Types.ObjectId(chatId),
    meetingId: meeting2._id,
    chatState: ChatState.WAITING,
    updatedAt: new Date(),
    messages: [
      {
        role: 'system',
        text: MEETING_CHAT_PROMPT,
        createdAt: new Date()
      },
      {
        role: 'system',
        text: 'This is a transcription',
        createdAt: new Date()
      },
      {
        role: 'user',
        text: 'What Hour is it',
        createdAt: new Date()
      },
      {
        role: 'system',
        text: 'It is 12:00',
        createdAt: new Date()
      }
    ]
  }).save()

  const chatId2 = '66642ff1440be060eaee5ff3'
  await new ChatEntity({
    _id: new mongoose.Types.ObjectId(chatId2),
    meetingId: meeting2._id,
    chatState: ChatState.IN_PROGRESS,
    updatedAt: new Date(),
    messages: [
      {
        role: 'system',
        text: MEETING_CHAT_PROMPT,
        createdAt: new Date()
      },
      {
        role: 'system',
        text: 'This is a transcription',
        createdAt: new Date()
      },
      {
        role: 'user',
        text: 'What Hour is it',
        createdAt: new Date()
      },
      {
        role: 'system',
        text: 'It is 12:00',
        createdAt: new Date()
      }
    ]
  }).save()
}
