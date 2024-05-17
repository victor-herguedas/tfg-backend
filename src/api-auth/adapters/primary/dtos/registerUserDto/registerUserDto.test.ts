import { beforeEach } from 'node:test'
import { describe, expect, test } from 'vitest'
import { getRegisterUserDto } from './registerUserDto.js'
import { type Request } from 'express'
import { ValidationError } from '../../../../../utilities/errors/ValidationError/ValidationError.js'
interface FakeRequest {
  body: {
    email: string
    password: string
    name: string
  }
}

const defaultBody = {
  email: 'victor@gmail.com',
  password: '123456',
  name: 'Victor'
}

const request: FakeRequest = {
  body: defaultBody
}

describe('Register User DTO', () => {
  beforeEach(() => {
    request.body = defaultBody
  })

  test('should accept a valid email, name and password', async () => {
    const registerUserDto = await getRegisterUserDto(request as unknown as Request)
    expect(registerUserDto).toStrictEqual(defaultBody)
  })

  test('should not accept a not valid email', async () => {
    request.body.email = 'wrongEmail'
    await expect(getRegisterUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })

  test('should trim the email and make it lowerCase', async () => {
    request.body.email = ' VicToR@gmail.COM'
    const validatedBody = await getRegisterUserDto(request as unknown as Request)
    expect(validatedBody.email).toBe('victor@gmail.com')
  })

  test('should not accept a not valid password', async () => {
    request.body.password = '12345'
    await expect(getRegisterUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })

  test('should not accept a not valid name', async () => {
    request.body.name = ''
    await expect(getRegisterUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })

  test('the password should be less than 30 characters', async () => {
    request.body.password = 'asdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavasasdavas'
    await expect(getRegisterUserDto(request as unknown as Request)).rejects.toThrowError(ValidationError)
  })
})
