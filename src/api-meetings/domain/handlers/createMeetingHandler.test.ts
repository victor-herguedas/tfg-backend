import { describe, expect, test, vi } from 'vitest'
import { getMeetingDtoMother } from '../../test/MeetingDtoMother.js'
import { getUserMother } from '../../../api-auth/test/UserMother.js'
import { TranscriptionState } from '../models/Meeting.js'
import * as MeetingDaoAdapterModule from '../../adapters/secondary/daoAdapters/MeetingDaoAdapter.js'
import { createMeetingHandler } from './createMeetingHandler.js'

describe('createMeetingHandler', () => {
  const saveMeetingSpy = vi.spyOn(MeetingDaoAdapterModule, 'saveMeeting')

  test('should return a meeting', async () => {
    const user = getUserMother({})
    const meetingDto = getMeetingDtoMother({})

    const result = await createMeetingHandler(meetingDto, user)
    expect(saveMeetingSpy).toHaveBeenCalledTimes(1)

    expect(result.name).toBe(meetingDto.name)
    expect(result.transcriptionState).toBe(TranscriptionState.IN_PROGRESS)
    expect(result.userId).toBe(user.id)
    expect(result.meetingDate).toBe(meetingDto.date)
  })
  // Validar que se llama a transcribir reunión con un espia
})
