import { beforeEach, describe, expect, test } from 'vitest'
import { createNewUserHandler } from './createUserHandler.js'
import { EmailAlreadyExistError } from '../../../../utilities/errors/EmailAlreadyExistError/EmailAlreadyExistError.js'
import { hashPassword } from '../../services/securityService/securityService.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { getRegisterUserDtoMother } from '../../../test/RegisterUserDTOMother.js'

describe('CreateUserService', () => {
  beforeEach(async () => {
    await restartDatabase()
  })
  const userDTO = getRegisterUserDtoMother({})

  test('should return a user', async () => {
    const newUSer = await createNewUserHandler(userDTO)
    expect(newUSer).toBeDefined()
  })

  test('should return a user with the same email', async () => {
    const newUSer = await createNewUserHandler(userDTO)
    expect(newUSer.email).toBe(userDTO.email)
  })

  test('should throw a EmailAlreadyExistError', async () => {
    const userDTO = getRegisterUserDtoMother({ email: 'newEmail@gmail.com' })
    await createNewUserHandler(userDTO)
    await expect(createNewUserHandler(userDTO)).rejects.toThrowError(EmailAlreadyExistError)
  })

  test('should hash the password and a salt', async () => {
    const userDTO = getRegisterUserDtoMother({ email: 'newEmailTest@gmail.com' })
    const password = userDTO.password
    const user = await createNewUserHandler(userDTO)
    expect(user.password).not.toBe(password)
    const hashedPassword = hashPassword(password, user.salt)
    expect(user.password).toBe(hashedPassword)
  })
})
