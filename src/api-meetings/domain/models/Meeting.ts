export enum TranscriptionState {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class Meeting {
  constructor (
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public transcription: string | null,
    public transcriptionState: TranscriptionState,
    public meetingDate: Date,
    public createdAt: Date
  ) {}
}
