import { beforeEach, describe, expect, test, vi, vitest } from 'vitest'
import { getUserMother } from '../../../test/UserMother.js'
import { findUserByEmail, findUserById, saveUser, updateUserLastConnection } from './UserRepository.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { UserEntity } from '../enitties/UserEntity.js'
import { type User } from '../../../domain/models/User.js'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'

describe('Save User', () => {
  beforeEach(async () => {
    await restartDatabase()
  })
  const userId = '664bbc255926673e7122649e'

  test('Should save a usser and return _id', async () => {
    const user = getUserMother({})
    const userEntity = await saveUser(
      user.email,
      user.salt,
      user.password,
      user.name
    )
    expect(userEntity.id).toBeDefined()
    expect(userEntity.email).toBe(user.email)
    expect(userEntity.salt).toBe(user.salt)
    expect(userEntity.password).toBe(user.password)
    expect(userEntity.name).toBe(user.name)
    expect(userEntity.roles[0]).toBe(user.roles[0])
  })

  test('Should return a DatabaseError if not correct model', async () => {
    const user = getUserMother({})
    await expect(saveUser(
      null as unknown as string,
      user.salt,
      user.password,
      user.name
    )).rejects.toThrowError(DatabaseError)
  })

  test('Should find a user by email', async () => {
    const user = getUserMother({})
    await saveUser(
      user.email,
      user.salt,
      user.password,
      user.name
    )
    const userFound = await findUserByEmail(user.email)
    expect(userFound).toBeDefined()
    if (userFound === null) throw new Error('User not found')
    expect(userFound.email).toBe(user.email)
  })

  test.todo('should have been created createdAt and updatedAt', async () => {
    const user = getUserMother({ email: 'test3User@gmail.com' })

    await saveUser(
      user.email,
      user.salt,
      user.password,
      user.name
    )
    const savedUser = await UserEntity.findOne({ email: user.email })
    expect(savedUser?.createdAt).toBeDefined()
    expect(savedUser?.updatedAt).toBeDefined()

    user.name = 'new name'
    vitest.setSystemTime(new Date().getTime() + 1000)
    await saveUser(
      user.email,
      user.salt,
      user.password,
      user.name
    )
    vitest.getRealSystemTime()
    const updatedUser = await UserEntity.findOne({ email: user.email })

    expect(updatedUser?.createdAt.toString()).toBe(updatedUser?.createdAt.toString())
    expect(updatedUser?.updatedAt.toString()).not.toBe(savedUser?.updatedAt.toString())
  })

  test('should find a user by id', async () => {
    const user = getUserMother({})
    const userSaved = await saveUser(
      user.email,
      user.salt,
      user.password,
      user.name
    )
    const userFound = await findUserById(userSaved.id)
    expect(userFound?.id).toBe(userSaved.id)
  })

  test('should update user last connection', async () => {
    let user = await findUserById(userId) as unknown as User
    const date = new Date()
    expect(user.lastConnection).not.toBe(date)

    vi.setSystemTime(date)
    await updateUserLastConnection(userId)

    console.log('user', user)
    user = await findUserById(userId) as unknown as User
    expect(user.lastConnection?.toUTCString()).toBe(date.toUTCString())

    vi.useRealTimers()
  }
  )
})
