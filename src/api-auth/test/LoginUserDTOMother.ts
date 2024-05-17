import { LoginUserDto } from '../adapters/primary/dtos/loginUserDto/loginUserDto.js'

interface Params {
  email?: string
  password?: string
}

export const getLoginUserDtoMother = (
  {
    email = 'exist@test.com',
    password = '12345678'
  }: Params
): LoginUserDto => {
  return new LoginUserDto(
    email,
    password
  )
}
