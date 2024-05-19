import { describe, test } from 'vitest'
import { getCreateMeetingDtoMother } from '../../test/CreateMeetingDtoMother.js'

describe('createMeetingHandler', () => {
  test('should return a meeting', () => {
    const meetingDto = getCreateMeetingDtoMother({})
  })
})
