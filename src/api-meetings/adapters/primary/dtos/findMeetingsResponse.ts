import { type Meeting } from '../../../domain/models/Meeting.js'

interface SHortMeetingResponse {
  id: string
  createdAt: Date
  meetingDate: Date
  name: string
  transcriptionState: string
  summary: string | null
  summaryState: string
  imageUrl: string | null
  imageState: string
}

export class FindMeetingsResponse {
  meetings: SHortMeetingResponse[]

  constructor (meetings: Meeting[]) {
    this.meetings = meetings.map((meeting) => ({
      id: meeting.id,
      createdAt: meeting.createdAt,
      meetingDate: meeting.meetingDate,
      name: meeting.name,
      transcriptionState: meeting.transcriptionState,
      summary: meeting.summary,
      summaryState: meeting.summaryState,
      imageUrl: meeting.imageUrl,
      imageState: meeting.imageState
    }))
  }
}
