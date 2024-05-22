import { type NextFunction, type Request, type Response } from 'express'
import { decodeAuthToken } from '../../api-auth/domain/services/securityService/securityService.js'
import { findUserByEmail } from '../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { UnautorizedError, getUnauthorizedErrorMessage } from '../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

export async function authMiddleware (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jwt = req.cookies.JWT as string
    const decodedJwt = await decodeAuthToken(jwt)
    const user = await findUserByEmail(decodedJwt.email)
    req.body.user = user
  } catch (error) {
    throw new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized'))
  }
  next()
}
