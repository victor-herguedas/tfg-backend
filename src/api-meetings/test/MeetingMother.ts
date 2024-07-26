import { Meeting, TranscriptionState, SummaryState, ImageState, type Todo, TodosState } from '../domain/models/Meeting.js'

interface Params {
  id?: string
  userId?: string
  name?: string
  transcription?: string | null
  transcriptionState?: TranscriptionState
  summary?: string | null
  summaryState?: SummaryState
  summaryCreatedAt?: Date | null
  imageName?: string | null
  imageUrl?: string | null
  imageState?: ImageState
  imageCreatedAt?: Date | null
  todos?: Todo[]
  todosState?: TodosState
  todosCreatedAt?: Date | null
  meetingDate?: Date
  createdAt?: Date
}

export const getMeetingMother = ({
  id = '66842c0524b5e7268a8050c8',
  userId = '664bbc255926673e7122649e',
  name = 'Welcome Meeting',
  transcription = 'Hello, welcome to the meeting.',
  transcriptionState = TranscriptionState.IN_PROGRESS,
  summary = 'Hello',
  summaryState = SummaryState.COMPLETED,
  summaryCreatedAt = new Date('2002-06-24'),
  imageName = 'image-name',
  imageUrl = 'image-url',
  imageState = ImageState.COMPLETED,
  todos = [{
    id: '66842c0524b5e7268a8050c8',
    todo: 'Hello, welcome to the meeting.',
    done: false
  }],
  todosState = TodosState.WAITING,
  todosCreatedAt = new Date('2002-06-24'),
  imageCreatedAt = new Date('2002-06-24'),
  meetingDate = new Date('2002-06-22'),
  createdAt = new Date('2002-06-22')
}: Params): Meeting => (new Meeting(
  id,
  userId,
  name,
  transcription,
  transcriptionState,
  summary,
  summaryState,
  summaryCreatedAt,
  imageName,
  imageUrl,
  imageState,
  imageCreatedAt,
  todos,
  todosState,
  todosCreatedAt,
  meetingDate,
  createdAt
))
