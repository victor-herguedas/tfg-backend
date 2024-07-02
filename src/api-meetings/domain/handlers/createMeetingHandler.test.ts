import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getMeetingDtoMother } from '../../test/MeetingDtoMother.js'
import { getUserMother } from '../../../api-auth/test/UserMother.js'
import { type Meeting, TranscriptionState } from '../models/Meeting.js'
import * as MeetingDaoAdapterModule from '../../adapters/secondary/repository/MeetingsRepository.js'
import { createMeetingHandler, generateAndSaveTranscription, generateShortDescription } from './createMeetingHandler.js'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { type FormFile } from '../../../utilities/serializations/audioSerialization.js'
import path from 'path'
import { MEDIA_PATH } from '../../../utilities/environment.js'
import { assert } from 'console'
import { getMeetingMother } from '../../test/MeetingMother.js'

describe('createMeetingHandler', () => {
  const saveMeetingSpy = vi.spyOn(MeetingDaoAdapterModule, 'saveMeeting')
  const meetingId = '664bbc255926673e7122649f'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a meeting', async () => {
    const user = getUserMother({})
    const meetingDto = getMeetingDtoMother({})

    const result = await createMeetingHandler(meetingDto, user)
    expect(saveMeetingSpy).toHaveBeenCalledTimes(1)

    expect(result.name).toBe(meetingDto.name)
    expect(result.summaryState).toBe('WAITING')
    // expect(result.transcriptionState).toBe(TranscriptionState.IN_PROGRESS)
    expect(result.userId).toBe(user.id)
    expect(result.meetingDate).toBe(meetingDto.date)
  })

  test('should generate and save transcription', async () => {
    const meetingId = '664bbc255926673e7122649f'
    const meeting = await MeetingDaoAdapterModule.findMeetingById((meetingId))
    if (meeting === null) throw new Error('Meeting not found')
    expect(meeting.transcription).toBe(null)
    expect(meeting.transcriptionState).toBe(TranscriptionState.IN_PROGRESS)
    const audioFilepath = path.join(MEDIA_PATH, 'test-media', 'test.mp3')
    const formFile: FormFile = { size: 0, filepath: audioFilepath, newFilename: audioFilepath, mimetype: 'audio/mp3', originalFilename: 'audio.mp3', mtime: new Date() }
    const newMeeting = await generateAndSaveTranscription(meeting, formFile)
    expect(newMeeting.transcription).not.toBe(null)
    expect(newMeeting.transcriptionState).toBe(TranscriptionState.COMPLETED)
    const findedMeeting = await MeetingDaoAdapterModule.findMeetingById(meetingId)
    expect(findedMeeting?.transcription).not.toBe(null)
    expect(findedMeeting?.transcriptionState).toBe(TranscriptionState.COMPLETED)
  })

  test('should generate shortDescription', async () => {
    const meeting = await MeetingDaoAdapterModule.findMeetingById(meetingId) as unknown as Meeting
    meeting.transcriptionState = TranscriptionState.COMPLETED
    meeting.transcription = 'Hello, welcome to the meeting.'
    assert(meeting.shortDescription === null)
    assert(meeting.shortDescriptionCreatedAt !== null)
    assert(meeting.shortDescriptionState !== null)
    const updatedMeeting = await generateShortDescription(meeting)
    assert(updatedMeeting.shortDescription !== null)
    assert(updatedMeeting.shortDescriptionCreatedAt !== null)
    assert(updatedMeeting.shortDescriptionState !== null)
  })

  test('should throw an error if transcription is not finished', async () => {
    const meeting = getMeetingMother({ transcriptionState: TranscriptionState.FAILED })
    assert(meeting.shortDescription === null)
    assert(meeting.shortDescriptionCreatedAt !== null)
    assert(meeting.shortDescriptionState !== null)
    await expect(generateShortDescription(meeting)).rejects.toThrow()
  })

  test.skip('Should save the state FAILED when the transcription fails', async () => {
    'TODO'
  })
})
