import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { findMeetingById } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { deleteMeetingByIdHandler } from './deleteMeetingByIdHandler.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

const meetingId = '664bbc255926673e7122649f'
const userId = '664bbc255926673e7122649e'
const userWithoutMeetingId = '6651a929c99b6216df26fca0'

describe('deleteMeetingByIdHandler', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should delete a meeting', async () => {
    const meeting = await findMeetingById(meetingId)

    await deleteMeetingByIdHandler(meeting?.id as unknown as string, userId)

    const meetingDeleted = await findMeetingById(meetingId)
    expect(meetingDeleted).toBeNull()
  })

  test('if is not meeting of the user should throw Unauthorized', async () => {
    await expect(deleteMeetingByIdHandler(meetingId, userWithoutMeetingId)).rejects.toThrow(UnautorizedError)
  })

  test('if meeting not found should throw NotFoundError', async () => {
    await expect(deleteMeetingByIdHandler('6651d349f5e70101e33d4ed9', userId)).rejects.toThrow(NotFoundError)
  })
})
