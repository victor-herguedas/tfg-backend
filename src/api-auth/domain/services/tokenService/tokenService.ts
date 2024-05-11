import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../../../utilities/environment.js'
import { UnautorizedError, getUnauthorizedErrorMessage } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type AuthTokenPayload, getAuthTokenPayload } from '../../models/AuthTokenPayload/AuthTokenPayload.js'
import { ValidationError } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export const generateAuthToken = (payload: Record<string, unknown>, secret: string, expiresIn: string): string => {
  return jwt.sign(payload, secret, { expiresIn })
}

export const generateSalt = (): string => {
  const salt = crypto.getRandomValues(new Uint8Array(4)).reduce((acc, value) => acc + value.toString(), '').toString().trim()
  return salt
}

export const generateSecret = (salt: string): string => {
  const secret = JWT_SECRET + salt
  return secret
}

export const decodeAuthToken = async (token: string, secret: string): Promise<AuthTokenPayload> => {
  try {
    const decodedToken = jwt.verify(token, secret)
    const authTokenPayload = await getAuthTokenPayload(decodedToken)
    console.log('llegamos')
    console.log(authTokenPayload)
    return authTokenPayload
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        throw new UnautorizedError(getUnauthorizedErrorMessage('ExpiredToken'))
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnautorizedError(getUnauthorizedErrorMessage('InvalidToken'))
      } else {
        throw new Error('Decode Token Unknown error')
      }
    } else if (error instanceof ValidationError) {
      throw new UnautorizedError(getUnauthorizedErrorMessage('InvalidTokenPayload'))
    } else {
      throw error
    }
  }
}
