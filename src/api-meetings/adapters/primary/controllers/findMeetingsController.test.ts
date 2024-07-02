import { beforeEach, describe, expect, test } from 'vitest'
import app from '../../../../index.js'
import req from 'supertest'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

const authToken = getUserTokenMother()

describe('Find Meetings Controller Integration Test', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 401 if not authenticated', async () => {
    const response = await req(app).get('/meetings?name=')
    expect(response.status).toBe(401)
  })

  test('Should return a list of meetings', async () => {
    const response = await req(app)
      .get('/meetings')
      .set('Cookie', `JWT=${authToken}`)
    expect(response.status).toBe(200)
    const meetings = response.body
    expect(meetings[0].id).toBeDefined()
    expect(meetings[0].createdAt).toBeDefined()
    expect(meetings[0].meetingDate).toBeDefined()
    expect(meetings[0].name).toBeDefined()
    expect(meetings[0].transcriptionState).toBeDefined()
  })

  test('Should filter the meetings', async () => {
    const response = await req(app)
      .get('/meetings')
      .set('Cookie', `JWT=${authToken}`)
    expect(response.status).toBe(200)
    const meetings = response.body
    expect(meetings[0].id).toBeDefined()
    expect(meetings[0].createdAt).toBeDefined()
    expect(meetings[0].meetingDate).toBeDefined()
    expect(meetings[0].name).toBeDefined()
    expect(meetings[0].transcriptionState).toBeDefined()

    const response2 = await req(app)
      .get('/meetings?name=victor')
      .set('Cookie', `JWT=${authToken}`)
    expect(response2.status).toBe(200)
    const meetings2 = response2.body
    expect(meetings2[0].id).toBeDefined()
    expect(meetings2[0].createdAt).toBeDefined()
    expect(meetings2[0].meetingDate).toBeDefined()
    expect(meetings2[0].name.includes('Victor')).toBeTruthy()
    expect(meetings2[0].transcriptionState).toBeDefined()

    expect(meetings.length as number).toBeGreaterThan(meetings2.length as number)
  })
})
