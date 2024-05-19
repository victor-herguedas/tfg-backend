import { EmailAlreadyExistError, getEmailAlreadyExistErrorMessage } from '../../../../utilities/errors/EmailAlreadyExistError/EmailAlreadyExistError.js'
import { type RegisterUserDto } from '../../../adapters/primary/dtos/registerUserDto/registerUserDto.js'
import { findUserByEmail, saveUser } from '../../../adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { User } from '../../models/User.js'
import { generateSalt, hashPassword } from '../../services/securityService/securityService.js'

export const createNewUser = async (userDTO: RegisterUserDto): Promise<User> => {
  await checkIsClonedUser(userDTO.email)

  let user = userDtoToUser(userDTO)
  replaceUserHashedPassword(user)

  user = await saveUser(user)
  return user
}

const checkIsClonedUser = async (email: string): Promise<void> => {
  const user = await findUserByEmail(email)
  const isClonedUser = user !== null
  if (isClonedUser) throw new EmailAlreadyExistError(getEmailAlreadyExistErrorMessage(email))
}

const userDtoToUser = (userDTO: RegisterUserDto): User => {
  return new User(
    null,
    userDTO.email,
    '',
    userDTO.password,
    userDTO.name,
    []
  )
}

const replaceUserHashedPassword = (user: User): User => {
  const salt = generateSalt()
  user.salt = salt
  const hashedPassword = hashPassword(user.password, user.salt)
  user.password = hashedPassword
  return user
}
