import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

const authToken = getUserTokenMother()
const meetingId = '664bbc255926673e7122649f'

describe('findMeetingByIdController', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 410 if not autenticated', async () => {
    const res = await req(app)
      .get('/meetings/sdids/')

    expect(res.status).toBe(401)
  })

  test('should return a Meeting', async () => {
    const res = await req(app)
      .get(`/meetings/${meetingId}`)
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(200)

    const meeting = res.body
    expect(meeting.id).toBe(meetingId)
    expect(meeting.name).toBeDefined()
    expect(meeting.transcription).toBeDefined()
  })

  test('should return 404 if meeting not found', async () => {
    const res = await req(app)
      .get('/meetings/6651c377dd11a30cbcad8a8a')
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(404)
  })
})
