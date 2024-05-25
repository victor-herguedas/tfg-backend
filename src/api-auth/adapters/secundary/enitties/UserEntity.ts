import mongoose, { type ObjectId } from 'mongoose'
import { User } from '../../../../../src/api-auth/domain/models/User.js'
import { mongodbConnection } from '../../../../utilities/mongodb/mongodb.js'

interface RolEntityInterface extends mongoose.Document {
  _id: ObjectId
  name: string
}

export interface UserEntityInterface extends mongoose.Document {
  _id: ObjectId
  email: string
  salt: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
  roles: RolEntityInterface[]
  toUser: () => User
}

const RolesEntitySchema = new mongoose.Schema({
  name: { type: String, required: true }
})

const userEntitySchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  salt: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, inmutable: true, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  roles: [RolesEntitySchema]
})

userEntitySchema.methods.toUser = function () {
  const userEntity = this as UserEntityInterface
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const _id = userEntity._id.toString()
  // console.log('userEntity', userEntity)

  return new User(
    _id,
    userEntity.email,
    userEntity.salt,
    userEntity.password,
    userEntity.name,
    userEntity.roles
  )
}

// export const convertUserToUserEntity = (user: User): UserEntityInterface => {
//   const userEntity = new UserEntity({
//     email: user.email,
//     salt: user.salt,
//     password: user.password,
//     name: user.name,
//     rols: user.rols
//   })
//   return userEntity
// }

export const UserEntity = mongodbConnection.model<UserEntityInterface>('User', userEntitySchema)
