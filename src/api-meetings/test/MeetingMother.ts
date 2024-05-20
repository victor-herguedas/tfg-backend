import { Meeting, TranscriptionState } from '../domain/models/Meeting.js'

interface Params {
  id?: string
  userId?: string
  name?: string
  transcription?: string | null
  transcriptionState?: TranscriptionState
  meetingDate?: Date
  createdAt?: Date
}

export const getMeetingMother = ({
  id = '123',
  userId = '456',
  name = 'Welcome Meeting',
  transcription = 'Hola, bienvenidos a la reunion',
  transcriptionState = TranscriptionState.IN_PROGRESS,
  meetingDate = new Date('2002-06-22'),
  createdAt = new Date('2002-06-22')
}: Params): Meeting => (new Meeting(
  id,
  userId,
  name,
  transcription,
  transcriptionState,
  meetingDate,
  createdAt
))
