import { User } from '../domain/models/User.js'

export const getUserMother = (
  {
    id = '60b1e6f2b0d2c5e3b0f2b8f7',
    email = 'test@gmail.com',
    salt = 'salt',
    password = 'password',
    name = 'test',
    rols = []
  }
): User => {
  return new User(
    id,
    email,
    salt,
    password,
    name,
    rols
  )
}
