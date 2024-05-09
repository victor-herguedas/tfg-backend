/* eslint-disable @typescript-eslint/consistent-type-imports */
import { expect, describe, test } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'

describe('POST /auth/register ', () => {
  test('should exist', async () => {
    const res = await req(app)
      .post('/auth/register')

    expect(res.status !== 404).toBeTruthy()
  })

  test('should return validation error with the field if no correct fields', async () => {
    const res = await req(app)
      .post('/auth/register')
      .send({
        email: 'wrongemail',
        password: '123456',
        name: 'Victor'
      })
    expect(res.status === 400).toBeTruthy()
    expect(res.body.type === 'ValidationError').toBeTruthy()
    expect(res.body.field === 'email').toBeTruthy()
  })

  test('should return 200 ok and username if correct credentials', async () => {
    const res = await req(app)
      .post('/auth/register')
      .send({
        email: 'victor@gmail.com',
        password: '123456',
        name: 'Victor'
      })
    expect(res.status === 201).toBeTruthy()
  })
})
