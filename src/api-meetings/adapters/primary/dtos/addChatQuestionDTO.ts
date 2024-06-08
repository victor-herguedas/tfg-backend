import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'
import { MAX_QUESTION_LENGTH } from '../../../../utilities/environment.js'

export class AddChatQuestionDto {
  constructor (
    public meetingId: string,
    public chatId: string,
    public question: string
  ) {}
}

const schema = vine.object({
  meetingId: vine.string().trim().minLength(1),
  chatId: vine.string().minLength(1),
  question: vine.string().minLength(1).maxLength(MAX_QUESTION_LENGTH)
})

export const getAddChatQuestionDto = async (req: Request): Promise<AddChatQuestionDto> => {
  try {
    const { question } = req.body
    const meetingId = req.params.id
    const chatId = req.params.chatId
    const fields = { meetingId, question, chatId }
    const validatedCreateMeetingData = await vine.validate({ schema, data: fields })
    return validatedCreateMeetingData
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw error
  }
}
