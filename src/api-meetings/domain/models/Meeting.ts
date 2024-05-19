type TranscriptionState = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export class Meeting {
  constructor (
    public readonly id: string,
    public readonly user: string,
    public name: string,
    public transcription: string | null,
    public transcriptionState: TranscriptionState,
    public meetingDate: Date,
    public createdAt: Date
  ) {}
}
