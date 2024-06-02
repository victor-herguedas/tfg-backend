import { type CreateChatDto } from '../../adapters/primary/dtos/createChatDto.js'
import { getChatMother } from '../../test/ChatMother.js'
import { type Chat } from '../models/Chat.js'

export const createChatHandler = async (createChatDto: CreateChatDto): Promise<Chat> => {
  return getChatMother({})
}
