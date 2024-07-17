import { beforeEach, describe, expect, test, vi } from 'vitest'
import { getMeetingDtoMother } from '../../test/MeetingDtoMother.js'
import { getUserMother } from '../../../api-auth/test/UserMother.js'
import { type Meeting, TranscriptionState, ShortDescriptionState, ImageState } from '../models/Meeting.js'
import * as MeetingDaoAdapterModule from '../../adapters/secondary/repository/MeetingsRepository.js'
import { createMeetingHandler, generateAndSaveTranscription, generateImage, generateShortDescription } from './createMeetingHandler.js'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { type FormFile } from '../../../utilities/serializations/audioSerialization.js'
import path from 'path'
import { MEDIA_PATH } from '../../../utilities/environment.js'

describe('createMeetingHandler', () => {
  const saveMeetingSpy = vi.spyOn(MeetingDaoAdapterModule, 'saveMeeting')
  const meetingId = '664bbc255926673e7122649f'
  const meetingToGenerateImage = '668ae4748488426e8ce25714'
  const meetingWithoutShortDescription = '666442d1a6cfe1fb896c5370'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a meeting', async () => {
    const user = getUserMother({})
    const meetingDto = getMeetingDtoMother({})

    const result = await createMeetingHandler(meetingDto, user)
    expect(saveMeetingSpy).toHaveBeenCalledTimes(1)

    expect(result.name).toBe(meetingDto.name)
    expect(result.shortDescriptionState).toBe('WAITING')
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
    expect(meeting.shortDescription === null)
    expect(meeting.shortDescriptionCreatedAt !== null)
    expect(meeting.shortDescriptionState !== null)
    const updatedMeeting = await generateShortDescription(meeting)
    expect(updatedMeeting.shortDescription !== null).toBeTruthy()
    expect(updatedMeeting.shortDescriptionCreatedAt !== null).toBeTruthy()
    expect(updatedMeeting.shortDescriptionState !== null).toBeTruthy()
  })

  test('should throw an error if transcription is not finished', async () => {
    const meeting = await MeetingDaoAdapterModule.findMeetingById(meetingId) as unknown as Meeting
    meeting.shortDescription = null
    expect(meeting.shortDescription === null).toBeTruthy()
    expect(meeting.shortDescriptionCreatedAt !== null).toBeTruthy()
    expect(meeting.shortDescriptionState !== null).toBeTruthy()
    await expect(generateShortDescription(meeting)).rejects.toThrow()

    const meetingSearch = await MeetingDaoAdapterModule.findMeetingById(meeting.id)
    console.log(meetingSearch)
    expect(meetingSearch?.shortDescriptionState === ShortDescriptionState.FAILED).toBeTruthy()
  })

  test('Should generate an image and save it in the database', async () => {
    const meeting = await MeetingDaoAdapterModule.findMeetingById(meetingToGenerateImage) as unknown as Meeting
    expect(meeting.imageName).toBe(null)
    expect(meeting.imageUrl).toBe(null)
    expect(meeting.imageState).toBe(ImageState.WAITING)
    expect(meeting.imageCreatedAt).toBe(null)

    await generateImage(meeting)

    const meetingWithImage = await MeetingDaoAdapterModule.findMeetingById(meetingToGenerateImage) as unknown as Meeting
    expect(meetingWithImage.imageName).toBeDefined()
    expect(meetingWithImage.imageUrl).toBeDefined()
    expect(meetingWithImage.imageState).toBe(ImageState.COMPLETED)
    expect(meetingWithImage.imageCreatedAt).toBeDefined()
  })

  test('Should throw an error if the short description is not generated', async () => {
    const meeting = await MeetingDaoAdapterModule.findMeetingById(meetingWithoutShortDescription) as unknown as Meeting
    expect(meeting.shortDescription).toBe(undefined)
    expect(meeting.shortDescriptionState).toBe(ShortDescriptionState.WAITING)
    expect(meeting.imageState).toBe(ImageState.WAITING)
    await expect(generateImage(meeting)).rejects.toThrow()
    const meetingWIthErrorImage = await MeetingDaoAdapterModule.findMeetingById(meetingWithoutShortDescription) as unknown as Meeting
    expect(meetingWIthErrorImage.imageState).toBe(ImageState.FAILED)
  })
})
