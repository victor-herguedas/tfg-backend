import { type User } from '../../../domain/models/User.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { UserEntity, convertUserToUserEntity } from '../enitties/UserEntity.js'

export const saveUser = async (user: User): Promise<User> => {
  try {
    const userEnity = convertUserToUserEntity(user)
    userEnity.updatedAt = new Date()
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

// updateUser

// deleteUser
