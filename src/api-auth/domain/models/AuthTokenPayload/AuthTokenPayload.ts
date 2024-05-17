import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'

export class AuthTokenPayload {
  id: string
  email: string

  constructor (id: string, email: string) {
    this.id = id
    this.email = email
  }
}

const schema = vine.object({
  id: vine.string().trim().minLength(1),
  email: vine.string().trim().email().toLowerCase()
})

export const getAuthTokenPayload = async (data: any): Promise<AuthTokenPayload> => {
  try {
    const authTokenPayload = await vine.validate({ schema, data })
    return (authTokenPayload)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
  }
  throw new Error('Unknown error')
}
