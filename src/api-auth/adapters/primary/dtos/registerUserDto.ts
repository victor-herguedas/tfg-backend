import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export class RegisterUserDto {
  email: string
  password: string
  name: string

  constructor (email: string, password: string, name: string) {
    this.email = email
    this.password = password
    this.name = name
  }
}

const schema = vine.object({
  email: vine.string().trim().email().toLowerCase(),
  password: vine.string().trim().minLength(6),
  name: vine.string().trim().minLength(1)
})

export const getRegisterUserDto = async (req: Request): Promise<RegisterUserDto> => {
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
