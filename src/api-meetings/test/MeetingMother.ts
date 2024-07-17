import { Meeting, TranscriptionState, ShortDescriptionState, ImageState } from '../domain/models/Meeting.js'

interface Params {
  id?: string
  userId?: string
  name?: string
  transcription?: string | null
  transcriptionState?: TranscriptionState
  shortDescription?: string | null
  shortDescriptionState?: ShortDescriptionState
  shortDescriptionCreatedAt?: Date | null
  imageName?: string | null
  imageUrl?: string | null
  imageState?: ImageState
  imageCreatedAt?: Date | null
  meetingDate?: Date
  createdAt?: Date
}

export const getMeetingMother = ({
  id = '66842c0524b5e7268a8050c8',
  userId = '664bbc255926673e7122649e',
  name = 'Welcome Meeting',
  transcription = 'Hello, welcome to the meeting.',
  transcriptionState = TranscriptionState.IN_PROGRESS,
  shortDescription = 'Hello',
  shortDescriptionState = ShortDescriptionState.COMPLETED,
  shortDescriptionCreatedAt = new Date('2002-06-24'),
  imageName = 'image-name',
  imageUrl = 'image-url',
  imageState = ImageState.COMPLETED,
  imageCreatedAt = new Date('2002-06-24'),
  meetingDate = new Date('2002-06-22'),
  createdAt = new Date('2002-06-22')
}: Params): Meeting => (new Meeting(
  id,
  userId,
  name,
  transcription,
  transcriptionState,
  shortDescription,
  shortDescriptionState,
  shortDescriptionCreatedAt,
  imageName,
  imageUrl,
  imageState,
  imageCreatedAt,
  meetingDate,
  createdAt
))
