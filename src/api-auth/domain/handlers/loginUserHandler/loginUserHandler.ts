import { UnautorizedError, getUnauthorizedErrorMessage } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { type LoginUserDto } from '../../../adapters/primary/dtos/loginUserDto/loginUserDto.js'
import { findUserByEmail } from '../../../adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { type User } from '../../models/User.js'
import { hashPassword } from '../../services/securityService/securityService.js'

export const logInUserHandler = async (userDTO: LoginUserDto): Promise<User> => {
  const user = await findUserByEmail(userDTO.email)

  if (user === null) throw new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized'))
  const dtoPasswordHashed = hashPassword(userDTO.password, user.salt)

  if (dtoPasswordHashed !== user.password) throw new UnautorizedError(getUnauthorizedErrorMessage('Unauthorized'))
  return user
}
