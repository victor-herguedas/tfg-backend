import { UserEntity, type UserEntityInterface } from '../adapters/secundary/enitties/UserEntity.js'

interface Params {
  _id?: string | null
  email?: string
  salt?: string
  password?: string
  name?: string
  createdAt?: Date
  updatedAt?: Date
  rols?: []

}

export const getUserEntityMother = (
  {
    _id = '60b1e6f2b0d2c5e3b0f2b8f7',
    email = 'test@gmail.com',
    salt = 'salt',
    password = 'password',
    name = 'test',
    createdAt = new Date(),
    updatedAt = new Date(),
    rols = []
  }: Params
): UserEntityInterface => {
  return new UserEntity({
    _id,
    email,
    salt,
    password,
    name,
    createdAt,
    updatedAt,
    rols
  })
}

export const getUserWithoutIdEntityMother = (
  {
    email = 'test@gmail.com',
    salt = 'salt',
    password = 'password',
    name = 'test',
    createdAt = new Date(),
    updatedAt = new Date(),
    rols = []
  }: Params
): UserEntityInterface => {
  return new UserEntity({
    email,
    salt,
    password,
    name,
    createdAt,
    updatedAt,
    rols
  })
}
