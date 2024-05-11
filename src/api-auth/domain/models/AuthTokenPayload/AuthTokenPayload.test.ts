import { describe, expect, test } from 'vitest'
import { getAuthTokenPayload } from './AuthTokenPayload.js'
import { ValidationError } from '../../../../utilities/errors/ValidationError/ValidationError.js'

describe('Register User DTO', () => {
  test('should accept a valid payload', async () => {
    const payload = {
      id: '1',
      email: 'prueba@gmail.com'
    }

    const authTokenPayload = await getAuthTokenPayload(payload)
    expect(authTokenPayload.id).toBe(payload.id)
  })

  test('should not accept a not valid payload', async () => {
    const payload = {}
    await expect(getAuthTokenPayload(payload)).rejects.toThrowError(ValidationError)
  })
})
