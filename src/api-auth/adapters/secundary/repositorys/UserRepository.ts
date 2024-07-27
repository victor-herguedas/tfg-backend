import { type User } from '../../../domain/models/User.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { UserEntity, type UserEntityInterface } from '../enitties/UserEntity.js'

export const saveUser = async (
  email: string,
  salt: string,
  password: string,
  name: string,
  roles: string[] = []): Promise<User> => {
  try {
    // const userEnity = convertUserToUserEntity(user)
    const userEnity: UserEntityInterface = new UserEntity({
      email,
      salt,
      password,
      name,
      roles
    })
    return (await userEnity.save()).toUser()
  } catch (error) {
    throw new DatabaseError()
  }
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const formatedEmail = email.trim().toLowerCase()
  const user = await UserEntity.findOne({ email: formatedEmail })
  return user?.toUser() ?? null
}

export const findUserById = async (id: string): Promise<User | null> => {
  const user = await UserEntity.findById(id)
  return user?.toUser() ?? null
}

export const updateUserLastConnection = async (id: string): Promise<void> => {
  await UserEntity.findByIdAndUpdate(id, { lastConnection: new Date() }, { new: true })
}

// updateUser

// deleteUser
