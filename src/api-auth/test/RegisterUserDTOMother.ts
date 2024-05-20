import { RegisterUserDto } from '../adapters/primary/dtos/registerUserDto/registerUserDto.js'

interface Params {
  email?: string
  password?: string
  name?: string
}

export const getRegisterUserDtoMother = (
  {
    email = 'test@gmail.com',
    password = 'password',
    name = 'test'
  }: Params
): RegisterUserDto => {
  return new RegisterUserDto(
    email,
    password,
    name
  )
}
