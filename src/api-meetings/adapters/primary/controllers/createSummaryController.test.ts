import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'

const meetingId = '664bbc255926673e7122649f'
const authToken = getUserTokenMother()

describe('createSummaryController', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 202 acepted', async () => {
    const res = await req(app)
      .post(`/meetings/${meetingId}/summary`)
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(202)
  })

  test('should return 401 Unauthorized', async () => {
    const res = await req(app)
      .post(`/meetings/${meetingId}/summary`)

    expect(res.status).toBe(401)
  })
})
