import { beforeEach, describe, expect, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { getUSer2TokenMother, getUserTokenMother } from '../../../../api-auth/test/userTokenMother.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

describe('saveTodosController', () => {
  const meetingId = '66cecb3e0cdccf15165cce32'
  const notOwnerToken = getUSer2TokenMother()
  const authToken = getUserTokenMother()
  const finalTodos = [
    {
      id: '1',
      todo: 'todo 1',
      done: false
    },
    {
      id: '2',
      todo: 'todo 2',
      done: true
    }
  ]

  beforeEach(async () => {
    await restartDatabase()
  })

  test('should save todos', async () => {
    let res = await req(app)
      .get(`/meetings/${meetingId}`)
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.todos).not.toEqual(finalTodos)

    res = await req(app)
      .put(`/meetings/${meetingId}/todos`)
      .set('Cookie', `JWT=${authToken}`)
      .send({
        todos: finalTodos
      })

    expect(res.status).toBe(201)

    res = await req(app)
      .get(`/meetings/${meetingId}`)
      .set('Cookie', `JWT=${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.todos).toEqual(finalTodos)
  })

  test('should return 401 if not the owner of the meeting', async () => {
    const res = await req(app)
      .put(`/meetings/${meetingId}/todos`)
      .set('Cookie', `JWT=${notOwnerToken}`)
      .send({
        todos: finalTodos
      })

    expect(res.status).toBe(401)
  })

  test('should return 404 if meeting not found', async () => {
    const res = await req(app)
      .put('/meetings/invented/todos')
      .set('Cookie', `JWT=${authToken}`)
      .send({
        todos: finalTodos
      })

    expect(res.status).toBe(404)
  })

  test('should return 400 wrong DTO', async () => {
    const res = await req(app)
      .put(`/meetings/${meetingId}/todos`)
      .set('Cookie', `JWT=${notOwnerToken}`)

    expect(res.status).toBe(400)
  })

  test('should be protectected', async () => {
    const res = await req(app).put(`/meetings/${meetingId}/todos`)
    expect(res.status).toBe(401)
  })
})
