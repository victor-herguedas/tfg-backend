import { type NextFunction, type Request, type Response } from 'express'
import { decodeAuthToken } from '../../api-auth/domain/services/securityService/securityService.js'
import { findUserById } from '../../api-auth/adapters/secundary/repositorys/UserRepository.js'
import { UnautorizedError, getUnauthorizedErrorMessage } from '../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

export async function authMiddleware (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const jwt = req.cookies.JWT as string
    const decodedJwt = await decodeAuthToken(jwt)
    const user = await findUserById(decodedJwt.id)
    if (user === null) {
      throw new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized'))
    }
    req.body.user = user
    next()
  } catch (error) {
    next(new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized')))
  }
}
