import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import app from '../../../../index.js'
import supertest from 'supertest'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { type ChatSummary } from '../../../domain/models/ChatSummary.js'

describe('findChatsController', () => {
  const token = getUserTokenMother()
  const meetingId = '665613cf110d408663836770'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a list of meetings', async () => {
    const response = await supertest(app)
      .get(`/meetings/${meetingId}/chats`)
      .set('Cookie', `JWT=${token}`)

    expect(response.status).toBe(200)
    const chats = response.body as unknown as ChatSummary[]
    expect(chats.length > 0).toBeTruthy()
  })

  test('should return 401', async () => {
    const response = await supertest(app)
      .get(`/meetings/${meetingId}/chats`)

    expect(response.status).toBe(401)
  })

  test('should return 404', async () => {
    const response = await supertest(app)
      .get('/meetings/noMeeting/chats')
      .set('Cookie', `JWT=${token}`)

    expect(response.status).toBe(404)
  })
})
