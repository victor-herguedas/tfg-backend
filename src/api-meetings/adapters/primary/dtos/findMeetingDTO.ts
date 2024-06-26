import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export class FindmeetingDTO {
  name: string | undefined
  constructor (name: string | undefined) {
    this.name = name
  }
}

const schema = vine.object({
  name: vine.string().trim().minLength(1).maxLength(30).optional()
})

export const getFindMeetingDto = async (req: Request): Promise<FindmeetingDTO> => {
  try {
    const { name } = req.query
    const validatedCreateMeetingData = await vine.validate({ schema, data: { name } })
    return new FindmeetingDTO(validatedCreateMeetingData.name)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw error
  }
}
