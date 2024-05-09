import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getvalidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

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
  email: vine.string().email().trim(),
  password: vine.string().minLength(6).trim(),
  name: vine.string().minLength(1).trim()
})

export const getRegisterUserDto = async (req: Request): Promise<RegisterUserDto> => {
  try {
    const validatedRegisterUserDto = await vine.validate({ schema, data: req.body })
    return (validatedRegisterUserDto)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getvalidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw new Error('Unexpected error')
  }
}
