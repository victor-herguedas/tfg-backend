import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'

const meetingId = '665613cf110d408663836770'
const authToken = getUserTokenMother()

describe('createSummaryController', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 201 and a summary', async () => {
    const res = await req(app)
      .post(`/meetings/${meetingId}/summary`)
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(201)
    expect(res.body.summary).toBeDefined()
  })

  test('should return 401 Unauthorized', async () => {
    const res = await req(app)
      .post(`/meetings/${meetingId}/summary`)

    expect(res.status).toBe(401)
  })
})
