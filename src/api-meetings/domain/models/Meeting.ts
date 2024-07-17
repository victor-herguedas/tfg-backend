export enum TranscriptionState {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ShortDescriptionState {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ImageState {
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

    public shortDescription: string | null,
    public shortDescriptionState: ShortDescriptionState,
    public shortDescriptionCreatedAt: Date | null,

    public imageName: string | null,
    public imageUrl: string | null,
    public imageState: ImageState,
    public imageCreatedAt: Date | null,

    public meetingDate: Date,
    public createdAt: Date
  ) {}
}
