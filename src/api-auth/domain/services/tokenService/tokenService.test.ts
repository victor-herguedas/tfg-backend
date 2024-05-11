import { describe, expect, test } from 'vitest'
import { decodeAuthToken, generateAuthToken, generateSalt, generateSecret } from './tokenService.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../../utilities/environment.js'
import { UnautorizedError } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

describe('TokenService tests', () => {
  const payload = {
    id: '1'
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

  test('should generate a secret', () => {
    const salt = generateSalt()
    const secret = generateSecret(salt)
    expect(secret).toBe(JWT_SECRET + salt)
  })

  test('should encode a token, decode it and get the same payload and expireTime', async () => {
    const salt = generateSalt()
    const secret = generateSecret(salt)

    const authToken = generateAuthToken(payload, secret, JWT_EXPIRES_IN)
    const decodedToken = await decodeAuthToken(authToken, secret)
    expect(decodedToken.id).toBe(payload.id)
  })

  test('should throw an error when the token is invalid', async () => {
    await expect(decodeAuthToken('asdbsadjjs', 'secret')).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken('asdbsadjjs', 'secret')).rejects.toThrowError('InvalidToken')
  })

  test('should throw an error when the token is expired', async () => {
    const salt = generateSalt()
    const secret = generateSecret(salt)

    const authToken = generateAuthToken(payload, secret, '-1s')
    await expect(decodeAuthToken(authToken, secret)).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken(authToken, secret)).rejects.toThrowError('ExpiredToken')
  })

  test('should throw an error when the token is invalid', async () => {
    const salt = generateSalt()
    const secret = generateSecret(salt)
    const wrongPayload = {}

    const authToken = generateAuthToken(wrongPayload, secret, JWT_EXPIRES_IN)
    await expect(decodeAuthToken(authToken, secret)).rejects.toThrowError(UnautorizedError)
    await expect(decodeAuthToken(authToken, secret)).rejects.toThrowError('InvalidTokenPayload')
  })

  // Tengo que validar que el payload del token sea valido la salida
})
