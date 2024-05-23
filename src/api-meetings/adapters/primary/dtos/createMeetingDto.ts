import { type Request } from 'express'
import { getAudioAndFieldsFromFromRequest, type FormFile } from '../../../../utilities/serializations/audioSerialization.js'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export class CreateMeetingDto {
  name: string
  date: Date
  audio: FormFile

  constructor (name: string, date: Date, audio: FormFile) {
    this.name = name
    this.date = date
    this.audio = audio
  }
}

const schema = vine.object({
  name: vine.string().trim().minLength(1).maxLength(30),
  date: vine.date()
})

export const getCreateMeetingDto = async (req: Request): Promise<CreateMeetingDto> => {
  try {
    const { audio, fields } = await getAudioAndFieldsFromFromRequest(req)
    Object.keys(fields as unknown as Record<string, string[]>).forEach((key: string) => {
      fields[key] = fields[key][0]
    })
    const validatedCreateMeetingData = await vine.validate({ schema, data: fields })
    return new CreateMeetingDto(validatedCreateMeetingData.name, validatedCreateMeetingData.date, audio)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw error
  }
}
