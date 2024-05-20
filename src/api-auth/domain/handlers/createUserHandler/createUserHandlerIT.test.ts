import { beforeEach, describe, expect, test } from 'vitest'
import { createNewUserHandler } from './createUserHandler.js'
import { EmailAlreadyExistError } from '../../../../utilities/errors/EmailAlreadyExistError/EmailAlreadyExistError.js'
import { hashPassword } from '../../services/securityService/securityService.js'
import { restartDatabase } from '../../../test/testUtils.js'
import { getRegisterDtoMother } from '../../../test/RegisterUserDTOMother.js'

describe('CreateUserService', () => {
  beforeEach(async () => {
    await restartDatabase()
  })
  const userDTO = getRegisterDtoMother({})

  test('should return a user', async () => {
    const newUSer = await createNewUserHandler(userDTO)
    expect(newUSer).toBeDefined()
  })

  test('should return a user with the same email', async () => {
    const newUSer = await createNewUserHandler(userDTO)
    expect(newUSer.email).toBe(userDTO.email)
  })

  test('should throw a EmailAlreadyExistError', async () => {
    const userDTO = getRegisterDtoMother({ email: 'newEmail@gmail.com' })
    await createNewUserHandler(userDTO)
    await expect(createNewUserHandler(userDTO)).rejects.toThrowError(EmailAlreadyExistError)
  })

  test('should hash the password and a salt', async () => {
    const userDTO = getRegisterDtoMother({ email: 'newEmailTest@gmail.com' })
    const password = userDTO.password
    const user = await createNewUserHandler(userDTO)
    expect(user.password).not.toBe(password)
    const hashedPassword = hashPassword(password, user.salt)
    expect(user.password).toBe(hashedPassword)
  })
})
