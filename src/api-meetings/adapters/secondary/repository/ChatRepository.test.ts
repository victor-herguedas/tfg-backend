import { beforeEach, describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../../utilities/test/testUtils.js'
import { findMeetingById } from './MeetingsRepository.js'
import { createChat, findChatsByMeetingId } from './ChatRepository.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'

describe('createChatHandler', () => {
  const meetingId: string = '664bbc255926673e7122649f'
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should throw a database error if a message does not exist', async () => {
    const meeting = await findMeetingById(meetingId) as unknown as Meeting
    await expect(createChat(meeting, '')).rejects.toThrow(DatabaseError)
  })

  test('should return empty list when meetingId incorrect when searching chats', async () => {
    const chats = await findChatsByMeetingId('wrong')
    expect(chats.toString()).toBe([].toString())
  })
})
