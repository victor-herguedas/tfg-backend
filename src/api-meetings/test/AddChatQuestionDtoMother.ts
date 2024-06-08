import { type AddChatQuestionDto } from '../adapters/primary/dtos/addChatQuestionDTO.js'

interface Params {
  meetingId?: string
  chatId?: string
  question?: string
}

export const getAddChatQuestionDtoMother = ({
  meetingId = '665613cf110d408663836770',
  chatId = '66620b847bda704c123cda07',
  question = 'What are the most important points?'
}: Params): AddChatQuestionDto => {
  return {
    meetingId,
    chatId,
    question
  }
}
