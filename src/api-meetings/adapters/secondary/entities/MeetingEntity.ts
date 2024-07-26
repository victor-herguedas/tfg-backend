import mongoose, { type ObjectId } from 'mongoose'
import { mongodbConnection } from '../../../../utilities/mongodb/mongodb.js'
import { ImageState, Meeting, type TodosState, type SummaryState, type TranscriptionState, type Todo } from '../../../domain/models/Meeting.js'
import { getFileUrlS3 } from '../repository/S3Repository.js'

interface TodoEntity {
  id: string
  todo: string
  done: boolean
}

export interface MeetingEntityInterface extends mongoose.Document {
  _id: ObjectId
  userId: ObjectId
  name: string
  transcription: string | null
  transcriptionState: TranscriptionState
  summary: string | null
  summaryState: SummaryState
  summaryCreatedAt: Date | null
  imageName: string | null
  imageState: ImageState
  imageCreatedAt: Date | null
  todos: TodoEntity[]
  todosState: TodosState
  todosCreatedAt: Date | null
  meetingDate: Date
  createdAt: Date

  toMeeting: () => Promise<Meeting>
}

const todoEntitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  todo: { type: String, required: true },
  done: { type: Boolean, required: true }
})

const meetingEntitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  name: { type: String, required: true },
  transcription: { type: String },
  transcriptionState: { type: String, required: true },
  summary: { type: String },
  summaryState: { type: String, required: true },
  summaryCreatedAt: { type: Date },
  imageName: { type: String },
  imageState: { type: String, required: true },
  imageCreatedAt: { type: Date },
  todos: [todoEntitySchema],
  todosState: { type: String, required: true },
  todosCreatedAt: { type: Date },
  meetingDate: { type: Date, required: true },
  createdAt: { type: Date, inmutable: true, default: () => new Date() }
})

meetingEntitySchema.methods.toMeeting = async function (): Promise<Meeting> {
  const meetingEntity = this as MeetingEntityInterface
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const _id = meetingEntity._id.toString()
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const userId = meetingEntity.userId.toString()

  let imageUrl: string | null = null

  try {
    if (meetingEntity.imageName !== null && meetingEntity.imageState === ImageState.COMPLETED) {
      imageUrl = await getFileUrlS3(meetingEntity.imageName)
    }
  } catch (error) {
    console.error('Error getting image URL: ', error)
  }

  let todos: Todo[] = []
  if (meetingEntity.todos !== undefined || meetingEntity.todos !== null) {
    todos = meetingEntity.todos.map((todoEntity) => {
      return {
        id: todoEntity.id,
        todo: todoEntity.todo,
        done: todoEntity.done
      }
    })
  }

  return new Meeting(
    _id,
    userId,
    meetingEntity.name,
    meetingEntity.transcription,
    meetingEntity.transcriptionState,
    meetingEntity.summary,
    meetingEntity.summaryState,
    meetingEntity.summaryCreatedAt,
    meetingEntity.imageName,
    imageUrl,
    meetingEntity.imageState,
    meetingEntity.imageCreatedAt,
    todos,
    meetingEntity.todosState,
    meetingEntity.todosCreatedAt,
    meetingEntity.meetingDate,
    meetingEntity.createdAt
  )
}

export const convertMeetingToMeetingEntity = (meeting: Meeting): MeetingEntityInterface => {
  let todos: TodoEntity[] = []
  if (meeting.todos !== undefined || meeting.todos !== null) {
    todos = meeting.todos.map((todo) => {
      return {
        id: todo.id,
        todo: todo.todo,
        done: todo.done
      }
    })
  }

  const meetingEntity = new MeetingEntity({
    _id: new mongoose.Types.ObjectId(meeting.id),
    userId: new mongoose.Types.ObjectId(meeting.userId),
    name: meeting.name,
    transcription: meeting.transcription,
    transcriptionState: meeting.transcriptionState,
    summary: meeting.summary,
    summaryState: meeting.summaryState,
    summaryCreatedAt: meeting.summaryCreatedAt,
    State: meeting.transcriptionState,
    imageName: meeting.imageName,
    imageUrl: meeting.imageUrl,
    imageState: meeting.imageState,
    imageCreatedAt: meeting.imageCreatedAt,
    todos,
    todosState: meeting.todosState,
    todosCreatedAt: meeting.todosCreatedAt,
    meetingDate: meeting.meetingDate,
    createdAt: meeting.createdAt
  })
  return meetingEntity
}

export const MeetingEntity = mongodbConnection.model<MeetingEntityInterface>('Meeting', meetingEntitySchema)
