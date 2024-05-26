export enum TranscriptionState {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum SummaryState {
  WAITING = 'WAITING',
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

    public summary: string | null,
    public summaryState: SummaryState,
    public summaryCreatedAt: Date | null,

    public meetingDate: Date,
    public createdAt: Date
  ) {}
}
