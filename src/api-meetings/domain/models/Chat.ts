export interface Message {
  role: string
  text: string
  createdAt: Date
}

export enum ChatState {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED'
}

export class Chat {
  constructor (
    public readonly id: string,
    public readonly meetingId: string,
    public chatState: ChatState,
    public createdAt: Date,
    public updatedAt: Date,
    public messages: Message[]
  ) {}
}
