import { type ChatState } from './Chat.js'

export class ChatSummary {
  constructor (
    public readonly id: string,
    public readonly meetingId: string,
    public chatState: ChatState,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
