/* eslint-disable @typescript-eslint/consistent-type-imports */
import { expect, describe, test, beforeEach } from 'vitest'
import req from 'supertest'
import app from '../../../../index.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { decodeAuthToken } from '../../../domain/services/securityService/securityService.js'
import { findUserByEmail } from '../../secundary/repositorys/UserRepository.js'
import { REGISTER_CODE } from '../../../../utilities/environment.js'
import { register } from 'module'

describe('POST /auth/register ', () => {
  beforeEach(async () => {
    await restartDatabase()
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

  test('should return 201 and return valid token', async () => {
    const email = 'victor@gmail.com'
    const res = await req(app)
      .post('/auth/register')
      .send({
        email,
        password: '123456',
        name: 'Victor',
        registerCode: REGISTER_CODE
      })
    expect(res.status === 201).toBeTruthy()
    const resHeadder = res.header['set-cookie'][0]
    const token = resHeadder.split('=')[1].split(';')[0]
    expect(token).toBeTruthy()
    const tokenName = resHeadder.split('=')[0]
    expect(tokenName).toBe('JWT')
    const tokenPayload = await decodeAuthToken(token)
    expect((tokenPayload).email).toBe(email)

    const insertedUser = await findUserByEmail(email)
    expect(tokenPayload.id).toBe(insertedUser?.id)
  })

  test('should return 400 if emailAlreadyExist', async () => {
    const res = await req(app)
      .post('/auth/register')
      .send({
        email: 'exist@test.com',
        password: '123456',
        name: 'Victor',
        registerCode: REGISTER_CODE
      })

    expect(res.status === 400).toBeTruthy()
  })

  test('should return 401 if wrong register code on register', async () => {
    const res = await req(app)
      .post('/auth/register')
      .send({
        email: 'notExist@test.com',
        password: '123456',
        name: 'Victor',
        registerCode: 'wrongCode'
      })

    expect(res.status).toBe(401)
  })
})

describe('POST /auth/login ', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return validation error with the field if no correct fields', async () => {
    const res = await req(app)
      .post('/auth/login')
      .send({
        email: 'wrongemail'
      })
    expect(res.status).toBe(400)
    expect(res.body.type === 'ValidationError').toBeTruthy()
    expect(res.body.field === 'email').toBeTruthy()
  })

  test('should return 200 and token if user login', async () => {
    const email = 'exist@test.com'
    const res = await req(app)
      .post('/auth/login')
      .send({
        email,
        password: '12345678'
      })
    expect(res.status).toBe(200)
    const resHeadder = res.header['set-cookie'][0]
    const token = resHeadder.split('=')[1].split(';')[0]
    const tokenName = resHeadder.split('=')[0]
    expect(tokenName).toBe('JWT')
    expect(token).toBeTruthy()
    const tokenPayload = await decodeAuthToken(token)
    expect((tokenPayload).email).toBe(email)
  })
})
