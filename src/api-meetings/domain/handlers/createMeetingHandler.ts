import { type User } from '../../../api-auth/domain/models/User.js'
import { type FormFile } from '../../../utilities/serializations/audioSerialization.js'
import { type CreateMeetingDto } from '../../adapters/primary/dtos/createMeetingDto.js'
import { saveMeeting, updateMeeting } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { saveFileS3 } from '../../adapters/secondary/repository/S3Repository.js'
import { TranscriptionState, ShortDescriptionState, type Meeting, ImageState } from '../models/Meeting.js'
import { generateAIImage, generateAIShortSummaryService } from '../services/chatGptService.js'
import { downloadImageToBufferService } from '../services/downloadImageService.js'
import { whisperTranscribe } from '../services/whisperService.js'

export const createMeetingHandler = async (createMeetingDto: CreateMeetingDto, user: User): Promise<Meeting> => {
  const meeting = await saveMeeting(createMeetingDto.name, createMeetingDto.date, user.id)
  generateAndSaveTranscription(meeting, createMeetingDto.audio).catch(console.error)
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
  generateShortDescription(meeting).catch(console.error)
  return savedMeeting
}

export const generateShortDescription = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.shortDescriptionState = ShortDescriptionState.IN_PROGRESS
    meeting = await updateMeeting(meeting)
    if (meeting.transcriptionState !== TranscriptionState.COMPLETED) throw new Error('Transcription is not completed and short summary can not be generated')
    if (meeting.transcription === null) throw new Error('Transcription is null')
    const shortSummary = await generateAIShortSummaryService(meeting.transcription)
    meeting.shortDescription = shortSummary
    meeting.shortDescriptionState = ShortDescriptionState.COMPLETED
    const updatedMeeting = await updateMeeting(meeting)
    generateImage(updatedMeeting).catch(console.error)
    return updatedMeeting
  } catch (error) {
    meeting.shortDescriptionState = ShortDescriptionState.FAILED
    await updateMeeting(meeting)
    throw error
  }
}

export const generateImage = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.imageState = ImageState.IN_PROGRESS
    meeting = await updateMeeting(meeting)
    if (meeting.shortDescription === null || meeting.shortDescriptionState !== ShortDescriptionState.COMPLETED) {
      throw new Error('Short description should be generated correctly')
    }
    const imageUrl = await generateAIImage(meeting.shortDescription)
    const file = await downloadImageToBufferService(imageUrl)
    const imageName = await saveFileS3(file)
    meeting.imageName = imageName
    meeting.imageState = ImageState.COMPLETED
    meeting.imageCreatedAt = new Date()
    await updateMeeting(meeting)
    return meeting
  } catch (error) {
    meeting.imageName = null
    meeting.imageState = ImageState.FAILED
    meeting.imageCreatedAt = null
    await updateMeeting(meeting)
    throw error
  }
}
