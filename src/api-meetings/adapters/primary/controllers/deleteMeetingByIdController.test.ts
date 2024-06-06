import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { findMeetingById } from '../../secondary/repository/MeetingsRepository.js'

const meetingId = '664bbc255926673e7122649f'
const authToken = getUserTokenMother()

describe('deleteMeetingByIdController', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 200 and deleted correctly', async () => {
    const response = await req(app)
      .delete(`/meetings/${meetingId}`)
      .set('Cookie', `JWT=${authToken}`)
    expect(response.status).toBe(200)

    const meeting = await findMeetingById(meetingId)
    expect(meeting).toBeNull()
  })

  test('should retun 401 if not authenticated', async () => {
    const response = await req(app)
      .delete(`/meetings/${meetingId}`)
    expect(response.status).toBe(401)
  })

  test('should return 404 if meeting not found', async () => {
    const response = await req(app).delete('/meetings/6651c377dd11a30cbcad8a8a').set('Cookie', `JWT=${authToken}`)
    expect(response.status).toBe(409)
  })
})
