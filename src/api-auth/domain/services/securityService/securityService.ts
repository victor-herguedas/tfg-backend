import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../../../utilities/environment.js'
import { UnautorizedError, getUnauthorizedErrorMessage } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type AuthTokenPayload, getAuthTokenPayload } from '../../models/AuthTokenPayload/AuthTokenPayload.js'
import { ValidationError } from '../../../../utilities/errors/ValidationError/ValidationError.js'
import bycript from 'bcrypt'
import { InternalError } from '../../../../utilities/errors/InternalError/InternalError.js'

export const generateSalt = (): string => {
  try {
    const salt = bycript.genSaltSync(10)
    return salt
  } catch (error) {
    throw new InternalError('Generate Salt Error')
  }
}

export const hashPassword = (password: string, salt: string): string => {
  try {
    const hashedPassword = bycript.hashSync(password, salt)
    return hashedPassword
  } catch (error) {
    throw new InternalError('Hash Password Error')
  }
}

export const generateAuthToken = (payload: AuthTokenPayload): string => {
  payload = { ...payload }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const decodeAuthToken = async (token: string): Promise<AuthTokenPayload> => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET)
    const authTokenPayload = await getAuthTokenPayload(decodedToken)
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
