import { describe, expect, test, vi } from 'vitest'
import { decodeAuthToken, generateAuthToken, generateSalt, hashPassword } from './securityService.js'
import { UnautorizedError } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type AuthTokenPayload } from '../../models/AuthTokenPayload/AuthTokenPayload.js'

describe('TokenService tests', () => {
  const payload = {
    id: '1',
    email: 'email@test.com'
  }

  test('should generate a salt', () => {
    const salt1 = generateSalt()
    const salt2 = generateSalt()
    expect(typeof salt1).toBe('string')
    expect(typeof salt2).toBe('string')
    expect(salt1 !== salt2).toBeTruthy()
    expect(salt1.length > 1).toBeTruthy()
    expect(salt2.length > 1).toBeTruthy()
  }
  )

  test('should encode a token, decode it and get the same payload and expireTime', async () => {
    const authToken = generateAuthToken(payload)
    const decodedToken = await decodeAuthToken(authToken)
    expect(decodedToken.id).toBe(payload.id)
  })

  test('should throw an error when the token is invalid', async () => {
    await expect(decodeAuthToken('asdbsadjjs')).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken('asdbsadjjs')).rejects.toThrowError('InvalidToken')
  })

  test('should throw an error when the token is expired', async () => {
    const authToken = generateAuthToken(payload)
    vi.setSystemTime(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

    await expect(decodeAuthToken(authToken)).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken(authToken)).rejects.toThrowError('ExpiredToken')
    vi.useRealTimers()
  })

  test('should throw an error when the token is invalid', async () => {
    const wrongPayload = {} as unknown as AuthTokenPayload

    const authToken = generateAuthToken(wrongPayload)
    await expect(decodeAuthToken(authToken)).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken(authToken)).rejects.toThrowError('InvalidTokenPayload')
  })

  test('should hash a password with correct salt', async () => {
    const password = 'password'
    const salt = generateSalt()
    const hashedPassword = hashPassword(password, salt)
    expect(hashedPassword).not.toBe(password)

    const salt2 = generateSalt()
    const hashedPassword2 = hashPassword(password, salt2)

    expect(hashedPassword2).not.toBe(password)

    const hashedPassword3 = hashPassword(password, salt)
    expect(hashedPassword3).toBe(hashedPassword)
  })

  // Tengo que validar que el payload del token sea valido la salida
})
