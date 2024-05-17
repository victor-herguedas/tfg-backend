import { beforeEach } from 'node:test'
import { describe, expect, test } from 'vitest'
import { getLoginUserDto } from './loginUserDto.js'
import { type Request } from 'express'
import { ValidationError } from '../../../../../utilities/errors/ValidationError/ValidationError.js'
interface FakeRequest {
  body: {
    email: string
    password: string
  }
}

const defaultBody = {
  email: 'victor@gmail.com',
  password: '123456'
}

const request: FakeRequest = {
  body: defaultBody
}

describe('Register User DTO', () => {
  beforeEach(() => {
    request.body = defaultBody
  })

  test('should not accept a not valid email', async () => {
    request.body.email = ''
    await expect(getLoginUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })

  test('should not accept a not valid password', async () => {
    request.body.password = ''
    await expect(getLoginUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })
})
