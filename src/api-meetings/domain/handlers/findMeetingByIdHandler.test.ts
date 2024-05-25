import { beforeEach, describe, expect, test } from 'vitest'
import { findMeetingByIdHandler } from './findMeetingByIDHandler.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

const userID = '664bbc255926673e7122649e'
const unauthorizedUserId = '6651a929c99b6216df26fca0'
const meetingID = '664bbc255926673e7122649f'
describe('findMeetingByIdHandler', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a Meeting', async () => {
    const meeting = await findMeetingByIdHandler(meetingID, userID)
    expect(meeting.id).toBe(meetingID)
    expect(meeting.name).toBeDefined()
  })

  test('should throw not found if meeting not found', async () => {
    await expect(findMeetingByIdHandler('6651c377dd11a30cbcad8a8a', userID)).rejects.toThrow(NotFoundError)
  })

  test('should throw not error if user is not the owner', async () => {
    await expect(findMeetingByIdHandler(meetingID, unauthorizedUserId)).rejects.toThrow(UnautorizedError)
  })
})
