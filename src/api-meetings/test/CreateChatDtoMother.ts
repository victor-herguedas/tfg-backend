import { type CreateChatDto } from '../adapters/primary/dtos/createChatDto.js'

interface Params {
  meetingId?: string
  message?: string
}

export const getCreateChatDtoMother = ({
  meetingId = '664bbc255926673e7122649f',
  message = 'Is it a intresting meeting?'
}: Params): CreateChatDto => {
  return {
    meetingId,
    message
  }
}
