import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { findMeetingById, saveMeeting } from './MeetingDaoAdapter.js'
import { findUserByEmail } from '../../../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'

describe('MeetingDaoAdapterIT', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should save and find the saved meeting', async () => {
    const user = await findUserByEmail('exist@test.com')
    console.log('user', user)
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
})
