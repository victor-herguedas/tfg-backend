import { ChatState, type Chat, type Message } from '../domain/models/Chat.js'

interface Params {
  id?: string
  meetingId?: string
  chatState?: ChatState
  createdAt?: Date
  updatedAt?: Date
  messages?: Message[]
}

const initialMessages = [
  {
    role: 'system',
    text: 'You are a personal assistant in charge of responding questions about the transcribed meeting that im going to start now',
    createdAt: new Date('2002-06-22')
  },
  {
    role: 'system',
    text: 'In this meeting we are gona talk about the new features of the app',
    createdAt: new Date('2002-06-23')
  },
  {
    role: 'user',
    text: 'What do you think about the new features?',
    createdAt: new Date('2002-06-23')
  }
]

export const getChatMother = ({
  id = '665ce735ffd104b87946b1bf',
  meetingId = '664bbc255926673e7122649f',
  chatState = ChatState.WAITING,
  createdAt = new Date('2002-06-22'),
  updatedAt = new Date('2002-06-24'),
  messages = initialMessages
}: Params): Chat => {
  return {
    id,
    meetingId,
    chatState,
    createdAt,
    updatedAt,
    messages
  }
}
