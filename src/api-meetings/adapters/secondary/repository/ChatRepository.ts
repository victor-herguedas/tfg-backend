import { isValidObjectId } from 'mongoose'
import { MEETING_CHAT_PROMPT } from '../../../../utilities/environment.js'
import { DatabaseError } from '../../../../utilities/errors/DatabaseError/DatabaseError.js'
import { ChatState, type Chat } from '../../../domain/models/Chat.js'
import { type Meeting } from '../../../domain/models/Meeting.js'
import { ChatEntity, type MessageEntityInterface } from '../entities/ChatEntity.js'

export const createChat = async (meeting: Meeting, message: string): Promise<Chat> => {
  try {
    const chat = await new ChatEntity({
      meetingId: meeting.id,
      chatState: ChatState.IN_PROGRESS,
      updatedAt: new Date(),
      messages: [
        {
          role: 'system',
          text: MEETING_CHAT_PROMPT,
          createdAt: new Date()
        },
        {
          role: 'system',
          text: meeting.transcription,
          createdAt: new Date()
        },
        {
          role: 'user',
          text: message,
          createdAt: new Date()
        }
      ]
    }).save()
    return chat.toDomain()
  } catch (error: any) {
    throw new DatabaseError(error.message as unknown as string)
  }
}

export const updateChatConversations = async (chatId: string, role: string, message: string): Promise<Chat> => {
  try {
    const chat = await ChatEntity.findById(chatId)
    if (chat === null) throw new DatabaseError(`Chat with ${chatId} not found`)
    chat.chatState = ChatState.WAITING
    chat.updatedAt = new Date()
    chat.messages.push(
      {
        role,
        text: message,
        createdAt: new Date()
      } as unknown as MessageEntityInterface)
    await chat.save()
    return chat.toDomain()
  } catch (error: any) {
    throw new DatabaseError(error.message as unknown as string)
  }
}

export const findChatsByMeetingId = async (meetingId: string): Promise<Chat[]> => {
  if (!isValidObjectId(meetingId)) return []
  const chats = await ChatEntity.find({ meetingId })
  if (chats === null) return []
  return chats.map(chat => chat.toDomain())
}

export const findChatById = async (chatId: string): Promise<Chat | null> => {
  if (!isValidObjectId(chatId)) return null
  const chat = await ChatEntity.findById(chatId)
  return chat?.toDomain() ?? null
}
