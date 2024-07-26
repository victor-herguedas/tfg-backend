import { type User } from '../../../api-auth/domain/models/User.js'
import { type FormFile } from '../../../utilities/serializations/audioSerialization.js'
import { type CreateMeetingDto } from '../../adapters/primary/dtos/createMeetingDto.js'
import { saveMeeting, updateMeeting } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { saveFileS3 } from '../../adapters/secondary/repository/S3Repository.js'
import { type Meeting, TranscriptionState, SummaryState, ImageState, TodosState } from '../models/Meeting.js'
import { generateAIImage, generateAISummaryService, generateAITodos } from '../services/chatGptService.js'
import { downloadImageToBufferService } from '../services/downloadImageService.js'
import { whisperTranscribe } from '../services/whisperService.js'

export const createMeetingHandler = async (createMeetingDto: CreateMeetingDto, user: User): Promise<Meeting> => {
  const meeting: Meeting = await saveMeeting(createMeetingDto.name, createMeetingDto.date, user.id)
  endMeetingGeneration(meeting, createMeetingDto.audio).catch(console.error)
  return meeting
}

const endMeetingGeneration = async (meeting: Meeting, audio: FormFile): Promise<void> => {
  meeting = await generateAndSaveTranscription(meeting, audio)
  meeting = await generateSummary(meeting)
  meeting = await generateTodos(meeting)
  await generateImage(meeting).catch(console.error)
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

export const generateSummary = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.summaryState = SummaryState.IN_PROGRESS
    meeting = await updateMeeting(meeting)
    if (meeting.transcriptionState !== TranscriptionState.COMPLETED) throw new Error('Transcription is not completed and summary can not be generated')
    if (meeting.transcription === null) throw new Error('Transcription is null')
    const summary = await generateAISummaryService(meeting.transcription)
    meeting.summary = summary
    meeting.summaryState = SummaryState.COMPLETED
    meeting.summaryCreatedAt = new Date()
    const updatedMeeting = await updateMeeting(meeting)
    return updatedMeeting
  } catch (error) {
    meeting.summaryState = SummaryState.FAILED
    await updateMeeting(meeting)
    throw error
  }
}

export const generateImage = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.imageState = ImageState.IN_PROGRESS
    meeting = await updateMeeting(meeting)
    if (meeting.summary === null || meeting.summaryState !== SummaryState.COMPLETED) {
      throw new Error('Summare should be generated correctly to generate an image')
    }
    const imageUrl = await generateAIImage(meeting.summary)
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

export const generateTodos = async (meeting: Meeting): Promise<Meeting> => {
  try {
    meeting.todosState = TodosState.IN_PROGRESS
    meeting = await updateMeeting(meeting)
    if (meeting.transcription === null || meeting.transcriptionState !== TranscriptionState.COMPLETED) {
      throw new Error('Transcription should be generated correctly to generate todos')
    }
    const todos = await generateAITodos(meeting.transcription)
    meeting.todos = todos
    meeting.todosState = TodosState.COMPLETED
    meeting.todosCreatedAt = new Date()
    await updateMeeting(meeting)
    return meeting
  } catch (error) {
    meeting.todos = []
    meeting.todosCreatedAt = null
    meeting.todosState = TodosState.FAILED
    await updateMeeting(meeting)
    throw error
  }
}
