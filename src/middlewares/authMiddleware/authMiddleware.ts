import { type NextFunction, type Request, type Response } from 'express'
import { decodeAuthToken } from '../../api-auth/domain/services/securityService/securityService.js'
import { findUserById } from '../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { UnautorizedError, getUnauthorizedErrorMessage } from '../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

export async function authMiddleware (req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const jwt = req.cookies.JWT as string
    const decodedJwt = await decodeAuthToken(jwt)
    console.log(decodedJwt)
    const user = await findUserById(decodedJwt.id)
    console.log(user)
    if (user === null) {
      throw new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized'))
    }
    req.body.user = user
    next()
  } catch (error) {
    console.log(error)
    next(new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized')))
  }
}
