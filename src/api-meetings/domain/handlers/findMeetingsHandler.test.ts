import { beforeEach, describe, expect, test } from 'vitest'
import { findMeetingsHandler } from './findMeetingsHandler.js'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { findUserByEmail } from '../../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { type User } from '../../../api-auth/domain/models/User.js'
import { DatabaseError } from '../../../utilities/errors/DatabaseError/DatabaseError.js'

describe('Find Meetings Handler', () => {
  let userWithMeetings: User = {} as unknown as User
  beforeEach(async () => {
    await restartDatabase()
    userWithMeetings = await findUserByEmail('exist@test.com') as unknown as User
  })

  test('should return a list of meetings', async () => {
    const meetigns = await findMeetingsHandler(userWithMeetings.id)
    expect(meetigns.length > 0).toBe(true)
    expect(meetigns[0].name).toBeDefined()
  })

  test('should return an empty list if the user does not have meetings', async () => {
    const userWithoutMeetings = await findUserByEmail('notMeetings@test.com') as unknown as User
    console.log(userWithoutMeetings)
    const meetings = await findMeetingsHandler(userWithoutMeetings.id)
    expect(meetings.length).toBe(0)
  })

  test('should throw a DatabaseError if the user does not exist', async () => {
    await expect(findMeetingsHandler('non-existing-user')).rejects.toThrow(DatabaseError)
  })
})
