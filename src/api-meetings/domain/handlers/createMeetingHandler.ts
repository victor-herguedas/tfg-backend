import { type User } from '../../../api-auth/domain/models/User.js'
import { type FormFile } from '../../../utilities/serializations/audioSerialization.js'
import { type CreateMeetingDto } from '../../adapters/primary/dtos/createMeetingDto.js'
import { saveMeeting, updateMeeting } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { TranscriptionState, ShortDescriptionState, type Meeting } from '../models/Meeting.js'
import { generateAIShortSummaryService } from '../services/chatGptService.js'
import { whisperTranscribe } from '../services/whisperService.js'

export const createMeetingHandler = async (createMeetingDto: CreateMeetingDto, user: User): Promise<Meeting> => {
  const meeting = await saveMeeting(createMeetingDto.name, createMeetingDto.date, user.id)
  generateAndSaveTranscription(meeting, createMeetingDto.audio).catch(console.error)
  generateShortDescription(meeting).catch(console.error)
  return meeting
}

export const generateAndSaveTranscription = async (meeting: Meeting, audio: FormFile): Promise<Meeting> => {
  try {
    const transcription = await whisperTranscribe(audio.filepath)
    meeting.transcription = transcription
    meeting.transcriptionState = TranscriptionState.COMPLETED
  } catch (error) {
    meeting.transcriptionState = TranscriptionState.FAILED
  }
  const savedMeeting = await updateMeeting(meeting)
  return savedMeeting
}

export const generateShortDescription = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.shortDescriptionState = ShortDescriptionState.IN_PROGRESS
    if (meeting.transcriptionState !== TranscriptionState.COMPLETED) throw new Error('Transcription is not completed and short summary can not be generated')
    if (meeting.transcription === null) throw new Error('Transcription is null')
    const shortSummary = await generateAIShortSummaryService(meeting.transcription)
    meeting.shortDescription = shortSummary
    meeting.shortDescriptionState = ShortDescriptionState.COMPLETED
    const updatedMeeting = await updateMeeting(meeting)
    return updatedMeeting
  } catch (error) {
    meeting.shortDescriptionState = ShortDescriptionState.FAILED
    throw error
  }
}
