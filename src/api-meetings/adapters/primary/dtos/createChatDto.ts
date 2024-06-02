import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export class CreateChatDto {
  constructor (
    public meetingId: string,
    public message: string
  ) {}
}

const schema = vine.object({
  meetingId: vine.string().trim().minLength(1),
  message: vine.string().minLength(1).maxLength(300)
})

export const getCreateChatDto = async (req: Request): Promise<CreateChatDto> => {
  try {
    const { message } = req.body
    const meetingId = req.params.id
    const fields = { meetingId, message }
    const validatedCreateMeetingData = await vine.validate({ schema, data: fields })
    return validatedCreateMeetingData
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw error
  }
}
