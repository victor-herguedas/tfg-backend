import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../../utilities/errors/ValidationError/ValidationError.js'

export class LoginUserDto {
  email: string
  password: string

  constructor (email: string, password: string) {
    this.email = email
    this.password = password
  }
}

const schema = vine.object({
  email: vine.string().trim().email().toLowerCase(),
  password: vine.string().trim().minLength(1).maxLength(30)
})

export const getLoginUserDto = async (req: Request): Promise<LoginUserDto> => {
  try {
    const validatedRegisterUserDto = await vine.validate({ schema, data: req.body })
    return (validatedRegisterUserDto)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw new Error('Unexpected error')
  }
}
