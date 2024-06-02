import { beforeEach } from 'node:test'
import { describe, expect, test } from 'vitest'
import { restartDatabase } from '../../../utilities/test/testUtils.js'
import { getChatDtoMother } from '../../test/CreateChatDtoMother.js'
import { createChatHandler } from './createChatHandler.js'

describe('createChatHandler', () => {
  beforeEach(async () => {
    await restartDatabase()
  })

  test('should return a chat', async () => {
    const chatDto = getChatDtoMother({})
    const chat = await createChatHandler(chatDto)
    expect(chat).toBeDefined()
    expect(chat.messages.length > 1).toBeTruthy()
  })
})
