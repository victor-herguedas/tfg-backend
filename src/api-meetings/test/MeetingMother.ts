import { Meeting, SummaryState, TranscriptionState, ShortDescriptionState } from '../domain/models/Meeting.js'

interface Params {
  id?: string
  userId?: string
  name?: string
  transcription?: string | null
  transcriptionState?: TranscriptionState
  summary?: string | null
  summaryState?: SummaryState
  shortDescription?: string | null
  shortDescriptionState?: ShortDescriptionState
  shortDescriptionCreatedAt?: Date | null
  summaryCreatedAt?: Date | null
  meetingDate?: Date
  createdAt?: Date
}

export const getMeetingMother = ({
  id = '66842c0524b5e7268a8050c8',
  userId = '664bbc255926673e7122649e',
  name = 'Welcome Meeting',
  transcription = 'Hello, welcome to the meeting.',
  transcriptionState = TranscriptionState.IN_PROGRESS,
  summary = 'In the they say hello.',
  summaryState = SummaryState.COMPLETED,
  shortDescription = 'Hello',
  shortDescriptionState = ShortDescriptionState.COMPLETED,
  shortDescriptionCreatedAt = new Date('2002-06-24'),
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
  shortDescription,
  shortDescriptionState,
  shortDescriptionCreatedAt,
  meetingDate,
  createdAt
))
