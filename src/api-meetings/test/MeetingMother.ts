import { Meeting, SummaryState, TranscriptionState } from '../domain/models/Meeting.js'

interface Params {
  id?: string
  userId?: string
  name?: string
  transcription?: string | null
  transcriptionState?: TranscriptionState
  summary?: string | null
  summaryState?: SummaryState
  summaryCreatedAt?: Date | null
  meetingDate?: Date
  createdAt?: Date
}

export const getMeetingMother = ({
  id = '123',
  userId = '456',
  name = 'Welcome Meeting',
  transcription = 'Hello, welcome to the meeting.',
  transcriptionState = TranscriptionState.IN_PROGRESS,
  summary = 'In the they say hello.',
  summaryState = SummaryState.COMPLETED,
  summaryCreatedAt = new Date('2002-06-24'),
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
  meetingDate,
  createdAt
))
