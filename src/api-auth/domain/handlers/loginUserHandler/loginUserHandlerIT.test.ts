import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../test/testUtils.js'
import { getUserMother } from '../../../test/UserMother.js'
import { logInUserHandler } from './loginUserHandler.js'
import { getLoginUserDtoMother } from '../../../test/LoginUserDTOMother.js'
import { UnautorizedError } from '../../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

describe('CreateUserService', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  const loginUserDTO = getLoginUserDtoMother({})

  const user = getUserMother({
    email: 'exist@test.com',
    id: '6647b353a08e072227f9d03a',
    salt: '$2b$10$LbS.ZxO5ISlYCb1WyJexa.',
    password: '$2b$10$LbS.ZxO5ISlYCb1WyJexa.Vga7MqasodpwcYW3vzkw8GOf1NlHVb.',
    name: 'exist',
    rols: []
  })

  test('should return a user', async () => {
    const getUser = await logInUserHandler(loginUserDTO)
    expect(getUser.email).toBe(user.email)
  })

  test('should return a unauthorized error if email does not exist', async () => {
    const notExistingUserDTO = getLoginUserDtoMother({ email: 'notExist@gmail.com' })
    await expect(logInUserHandler(notExistingUserDTO)).rejects.toThrow(UnautorizedError)
  })

  test('should return a unauthorized if passwords are not the same', async () => {
    const notExistingUserDTO = { ...user, password: 'wrongPassword' }
    await expect(logInUserHandler(notExistingUserDTO)).rejects.toThrow(UnautorizedError)
  })
})
