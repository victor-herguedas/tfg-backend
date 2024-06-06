import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { findMeetingById, findMeetingsByUserId, saveMeeting, updateMeeting } from './MeetingsRepository.js'
import { findUserByEmail } from '../../../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'

describe('MeetingDaoAdapterIT', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should save and find the saved meeting', async () => {
    const user = await findUserByEmail('exist@test.com')
    if (user === null) throw new Error('User not found')
    const userId = user.id
    const name = 'Kickoff meeting'
    const date = new Date('2002-06-22')
    const meeting = await saveMeeting(name, date, userId)
    expect(meeting.name).toBe(name)

    const foundMeeting = await findMeetingById(meeting.id)
    expect(foundMeeting?.id).toBe(meeting.id)
    expect(foundMeeting?.name).toBe(name)
  })

  test('should update the meeting', async () => {
    const meeting = await findMeetingById('664bbc255926673e7122649f')
    if (meeting === null) throw new Error('Meeting not found')
    meeting.name = 'Changed name'
    const result = await updateMeeting(meeting)
    expect(result.name).toBe('Changed name')
    const changedMeeting = await findMeetingById(meeting.id)
    expect(changedMeeting?.name).toBe('Changed name')
  })

  test('should return null when meetingId is not an objectId', async () => {
    const meeting = await findMeetingById('notAnObjectId')
    expect(meeting).toBe(null)
  })

  test('should return empty list when meetingByUserId incorrect', async () => {
    const meeting = await findMeetingsByUserId('wrong')
    expect(meeting.toString()).toBe([].toString())
  })
})
