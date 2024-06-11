import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import req from 'supertest'
import app from '../../../../index.js'
import { getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'

describe('addChatQuestionController', () => {
  const token = getUserTokenMother()
  const chatId = '66620b847bda704c123cda07'
  const chatInProgessId = '66642ff1440be060eaee5ff3'
  const meetignId = '665613cf110d408663836770'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return 202 accepted', async () => {
    const res = await req(app)
      .put(`/meetings/${meetignId}/summary/chats/${chatId}`)
      .set('Cookie', `JWT=${token}`)
      .send({ question: 'question' })
    expect(res.status).toBe(202)
  })

  test('should return 404 not found', async () => {
    const res = await req(app)
      .put(`/meetings/${meetignId}/summary/chats/1`)
      .set('Cookie', `JWT=${token}`)
      .send({ question: 'question' })
    expect(res.status).toBe(404)
  })

  test('should return 400 if no correct body', async () => {
    const res = await req(app)
      .put(`/meetings/${meetignId}/summary/chats/${chatId}`)
      .set('Cookie', `JWT=${token}`)
      .send({ wrong: 'question' })
    expect(res.status).toBe(400)
  })

  test('Should return 401 if no token is provided', async () => {
    const res = await req(app).put('/meetings/1/summary/chats/1')
    expect(res.status).toBe(401)
  })

  test('Si el chat está en estado IN_PROGRESS se lanza un error', async () => {
    const res = await req(app)
      .put(`/meetings/${meetignId}/summary/chats/${chatInProgessId}`)
      .set('Cookie', `JWT=${token}`)
      .send({ question: 'question' })
    expect(res.status).toBe(409)
  })
})
