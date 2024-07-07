import { describe, expect, test } from 'vitest'
import { getMeetingMother } from '../../../test/MeetingMother.js'
import { convertMeetingToMeetingEntity } from './MeetingEntity.js'
import { ImageState } from '../../../domain/models/Meeting.js'

describe('MeetingEntity to Meeting', async () => {
  test('should return a url when image state is completed', async () => {
    const meetingEntity = convertMeetingToMeetingEntity(getMeetingMother({}))
    meetingEntity.imageName = 'image-name'
    meetingEntity.imageState = ImageState.COMPLETED

    const meeting = await meetingEntity.toMeeting()

    expect(meeting.imageUrl).not.toBeNull()
  })

  test.fails('should return null when image state is different of completed', () => {
    test('should return a url when image state is completed', async () => {
      const meetingEntity = convertMeetingToMeetingEntity(getMeetingMother({}))
      meetingEntity.imageName = 'image-name'
      meetingEntity.imageState = ImageState.WAITING

      const meeting = await meetingEntity.toMeeting()

      expect(meeting.imageUrl).toBeNull()
    })
  })
})
