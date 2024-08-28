import { type Request } from 'express'
import vine, { errors } from '@vinejs/vine'
import { ValidationError, getValidationErrorMessage } from '../../../../utilities/errors/ValidationError/ValidationError.js'
class todoDTO {
  id: string
  todo: string
  done: boolean

  constructor (
    id: string,
    todo: string,
    done: boolean
  ) {
    this.id = id
    this.todo = todo
    this.done = done
  }
}

export class SaveTodosDTO {
  constructor (
    public todos: todoDTO[],
    public meetingId: string
  ) {}
}

const schema = vine.object({
  meetingId: vine.string().trim().minLength(1),
  todos: vine.array(vine.object({
    id: vine.string().trim().minLength(1),
    todo: vine.string().minLength(1),
    done: vine.boolean()
  }))
})

export const getSaveTodosDto = async (req: Request): Promise<SaveTodosDTO> => {
  try {
    const { todos } = req.body
    const meetingId = req.params.id
    const fields = { meetingId, todos }
    const validatedSaveTodosData = await vine.validate({ schema, data: fields })
    return validatedSaveTodosData
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      throw new ValidationError(getValidationErrorMessage(error.messages[0].field as unknown as string, error.messages[0].message as unknown as string))
    }
    throw error
  }
}
