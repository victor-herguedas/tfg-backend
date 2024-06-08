import { OpenAIError } from 'openai'
import { NotFoundError, getNotFoundErrorMessage } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { updateMeeting } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { type Meeting, SummaryState } from '../models/Meeting.js'
import { generateAISummaryService } from '../services/chatGptService.js'
import { ActionAlreadyRunningError, getActionAlreadyRunningErrorMessage } from '../../../utilities/errors/ActionAlreadyRuningError/ActionAlredyRunningError.js'
import { ResourceAlreadyExistError, getResourceAlreadyExistError } from '../../../utilities/errors/ResourceAlreadyExistError/ResourceAlreadyExistError.js'
import { findMeetingByIdSecured } from '../../adapters/secondary/repository/MeetingsSecuredRepository.js'

export const createSummaryHandler = async (meetingId: string, userId: string): Promise<void> => {
  const meeting = await findMeetingByIdSecured(meetingId, userId)
  if (meeting === null) throw new NotFoundError(getNotFoundErrorMessage('Meeting: ' + meetingId))
  if (meeting.summaryState === SummaryState.IN_PROGRESS) throw new ActionAlreadyRunningError(getActionAlreadyRunningErrorMessage('Create summary for meeting: ' + meetingId))
  if (meeting.summaryState === SummaryState.COMPLETED) throw new ResourceAlreadyExistError(getResourceAlreadyExistError('Summary for meeting: ' + meetingId))
  await updateMeetingWithSummaryState(meeting, SummaryState.IN_PROGRESS)

  generateMeetingSummary(meeting).catch(async (error: any) => {
    console.log(error)
  })
}

const generateMeetingSummary = async (meeting: Meeting): Promise<Meeting> => {
  try {
    const summary = await generateAISummaryService(meeting.transcription as unknown as string)
    meeting.summary = summary
  } catch (error: any) {
    meeting.summaryState = SummaryState.FAILED
    await updateMeeting(meeting)
    throw new OpenAIError('chatGpt4o: ' + error.message)
  }

  return await updateMeetingWithSummaryState(meeting, SummaryState.COMPLETED)
}

export const updateMeetingWithSummaryState = async (meeting: Meeting, state: SummaryState): Promise<Meeting> => {
  meeting.summaryState = state
  meeting = await updateMeeting(meeting)
  return meeting
}
