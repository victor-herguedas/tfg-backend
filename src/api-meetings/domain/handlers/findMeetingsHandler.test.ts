import { beforeEach, describe, expect, test } from 'vitest'
import { findMeetingsHandler } from './findMeetingsHandler.js'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { findUserByEmail } from '../../../api-auth/adapters/secundary/repositorys/UserRepository.js'
import { type User } from '../../../api-auth/domain/models/User.js'

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
    const meetings = await findMeetingsHandler(userWithoutMeetings.id)
    expect(meetings.length).toBe(0)
  })

  test('should return empty list when userId does not exist', async () => {
    expect((await findMeetingsHandler('non-existing-user')).toString()).toBe([].toString())
  })
})
