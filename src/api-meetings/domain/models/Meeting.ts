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

export enum ImageState {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TodosState {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class Todo {
  constructor (
    public readonly id: string,
    public todo: string,
    public done: boolean
  ) {}
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

    public imageName: string | null,
    public imageUrl: string | null,
    public imageState: ImageState,
    public imageCreatedAt: Date | null,

    public todos: Todo[],
    public todosState: TodosState,
    public todosCreatedAt: Date | null,

    public meetingDate: Date,
    public createdAt: Date
  ) {}
}
