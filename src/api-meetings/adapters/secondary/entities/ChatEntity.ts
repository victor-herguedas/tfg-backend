import mongoose, { type ObjectId } from 'mongoose'
import { mongodbConnection } from '../../../../utilities/mongodb/mongodb.js'
import { type ChatState, Chat } from '../../../domain/models/Chat.js'
import { ChatSummary } from '../../../domain/models/ChatSummary.js'

export interface MessageEntityInterface {
  role: string
  text: string
  createdAt: Date
}

export interface ChatEntityInterface extends mongoose.Document {
  _id: ObjectId
  meetingId: ObjectId
  chatState: ChatState
  createdAt: Date
  updatedAt: Date
  messages: MessageEntityInterface[]

  toChat: () => Chat
  toChatSummary: () => ChatSummary
}

const messageEntitySchema = new mongoose.Schema({
  role: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, required: true }
})

const chatEntitySchema = new mongoose.Schema({
  meetingId: { type: mongoose.Schema.ObjectId, required: true, ref: 'Meeting' },
  chatState: { type: String, required: true },
  updatedAt: { type: Date, required: true },
  createdAt: { type: Date, inmutable: true, default: () => new Date() },
  messages: [messageEntitySchema]
})

chatEntitySchema.methods.toChat = function () {
  const chatEntity = this as ChatEntityInterface
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const _id = chatEntity._id.toString()
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const meetingId = chatEntity.meetingId.toString()

  return new Chat(
    _id,
    meetingId,
    chatEntity.chatState,
    chatEntity.createdAt,
    chatEntity.updatedAt,
    chatEntity.messages
  )
}

chatEntitySchema.methods.toChatSummary = function () {
  const chatEntity = this as ChatEntityInterface
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const _id = chatEntity._id.toString()
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const meetingId = chatEntity.meetingId.toString()

  return new ChatSummary(
    _id,
    meetingId,
    chatEntity.chatState,
    chatEntity.createdAt,
    chatEntity.updatedAt
  )
}

export const convertChatToChatEntity = (chat: Chat): ChatEntityInterface => {
  const chatEntity = new ChatEntity({
    _id: new mongoose.Types.ObjectId(chat.id),
    meetingId: new mongoose.Types.ObjectId(chat.meetingId),
    chatState: chat.chatState,
    updatedAt: chat.updatedAt,
    createdAt: chat.createdAt,
    messages: chat.messages.map((message) => {
      return {
        role: message.role,
        text: message.text,
        createdAt: message.createdAt
      }
    })
  })
  return chatEntity
}

export const ChatEntity = mongodbConnection.model<ChatEntityInterface>('Chat', chatEntitySchema)
