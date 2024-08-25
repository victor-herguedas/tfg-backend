import { REGISTER_CODE } from '../../utilities/environment.js'
import { RegisterUserDto } from '../adapters/primary/dtos/registerUserDto/registerUserDto.js'

interface Params {
  email?: string
  password?: string
  name?: string
  registerCode?: string
}

export const getRegisterUserDtoMother = (
  {
    email = 'test@gmail.com',
    password = 'password',
    name = 'test',
    registerCode = REGISTER_CODE
  }: Params
): RegisterUserDto => {
  return new RegisterUserDto(
    email,
    password,
    name,
    registerCode
  )
}
