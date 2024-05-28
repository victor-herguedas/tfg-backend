// Buscarme la forma de meter un espía para comprobar que se guarda el summaryState a in progress

import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { type User } from '../../../api-auth/domain/models/User.js'
import { SummaryState, type Meeting } from '../models/Meeting.js'
import { findUserByEmail } from '../../../api-auth/adapters/secundary/daoAdapters/UserDaoAdapter.js'
import { findMeetingById } from '../../adapters/secondary/repository/MeetingsRepository.js'
import { NotFoundError } from '../../../utilities/errors/NotFoundError/NotFoundError.js'
import { createSummaryHandler, updateMeetingWithSummaryState } from './createSummaryHandler.js'
import { OpenAIError } from 'openai'
import { ActionAlreadyRunningError } from '../../../utilities/errors/ActionAlreadyRuningError/EmailAlreadyExistError.js'
import { ResourceAlreadyExistError } from '../../../utilities/errors/ResourceAlreadyExistError/ResourceAlreadyExistError.js'
import { UnautorizedError } from '../../../utilities/errors/UnauthorizedError/UnauthorizedError.js'

describe('createSummaryHandler', () => {
  let registeredUser = {} as unknown as User
  let meetingWithoutSummary = {} as unknown as Meeting
  beforeEach(async () => {
    await restartDatabase()
    registeredUser = await findUserByEmail('exist@test.com') as unknown as User
    meetingWithoutSummary = await findMeetingById('665613cf110d408663836770') as unknown as Meeting
  })

  test('should create a summary and save it with the state', async () => {
    expect(meetingWithoutSummary.summaryState).toBe(SummaryState.WAITING)

    await createSummaryHandler(meetingWithoutSummary.id, registeredUser.id)

    const meetingWithSummary = await findMeetingById(meetingWithoutSummary.id)
    expect(meetingWithSummary?.summaryState).toBe(SummaryState.COMPLETED)
    expect(meetingWithSummary?.summary).toBeDefined()
  })

  test('if meeting not found should throw an error', async () => {
    await expect(createSummaryHandler('6653b89f8047a41f4eacac00', registeredUser.id)).rejects.toThrow(NotFoundError)
  })

  test('Should update meeting state to in progress', async () => {
    expect(meetingWithoutSummary.summaryState).toBe(SummaryState.WAITING)

    const updatedMeeting = await updateMeetingWithSummaryState(meetingWithoutSummary, SummaryState.IN_PROGRESS)
    expect(updatedMeeting.summaryState).toBe(SummaryState.IN_PROGRESS)

    const meetingWithSummary = await findMeetingById(meetingWithoutSummary.id)
    expect(meetingWithSummary?.summaryState).toBe(SummaryState.IN_PROGRESS)
  })

  test('should save transcription failed state and return OPENAIERROR', async () => {
    // Hay que hacerlo con un mock a openAiSession.chat.completions.create para que falle
    const meetingWithSummary = await findMeetingById(meetingWithoutSummary.id) as unknown as Meeting
    meetingWithSummary.transcription = null
    await updateMeetingWithSummaryState(meetingWithSummary, SummaryState.WAITING)
    await expect(createSummaryHandler(meetingWithoutSummary.id, registeredUser.id)).rejects.toThrow(OpenAIError)
  })

  test('if meeting summary state is in progress should throw ActionAlreadyRunningError', async () => {
    await updateMeetingWithSummaryState(meetingWithoutSummary, SummaryState.IN_PROGRESS)
    await expect(createSummaryHandler(meetingWithoutSummary.id, registeredUser.id)).rejects.toThrow(ActionAlreadyRunningError)
  })

  test('if meeting summary state is in COMPLETED should throw ResourceAlreadyExistError', async () => {
    await updateMeetingWithSummaryState(meetingWithoutSummary, SummaryState.COMPLETED)

    await expect(createSummaryHandler(meetingWithoutSummary.id, registeredUser.id)).rejects.toThrow(ResourceAlreadyExistError)
  })

  test('if not user meeting should throw an error', async () => {
    const userWithoutMeeting = await findMeetingById('664bbc255926673e7122649f') as unknown as Meeting
    await expect(createSummaryHandler(meetingWithoutSummary.id, userWithoutMeeting.id)).rejects.toThrow(UnautorizedError)
  })
})
