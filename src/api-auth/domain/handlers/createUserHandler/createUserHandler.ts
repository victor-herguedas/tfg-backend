import { EmailAlreadyExistError, getEmailAlreadyExistErrorMessage } from '../../../../utilities/errors/EmailAlreadyExistError/EmailAlreadyExistError.js'
import { type RegisterUserDto } from '../../../adapters/primary/dtos/registerUserDto/registerUserDto.js'
import { findUserByEmail, saveUser } from '../../../adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { User } from '../../models/User.js'
import { generateSalt, hashPassword } from '../../services/securityService/securityService.js'

export const createNewUserHandler = async (userDto: RegisterUserDto): Promise<User> => {
  await checkIsClonedUser(userDto.email)

  let user = userDtoToUser(userDto)
  replaceUserHashedPassword(user)

  user = await saveUser(
    userDto.email,
    user.salt,
    user.password,
    user.name
  )
  return user
}

const checkIsClonedUser = async (email: string): Promise<void> => {
  const user = await findUserByEmail(email)
  const isClonedUser = user !== null
  if (isClonedUser) throw new EmailAlreadyExistError(getEmailAlreadyExistErrorMessage(email))
}

const userDtoToUser = (userDTO: RegisterUserDto): User => {
  return new User(
    '',
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
