import { type Todo } from '../models/Meeting.js'
import vine from '@vinejs/vine'

export const formatTodosService = async (todos: any): Promise<Todo[]> => {
  const schema = vine.array(vine.object({
    id: vine.string().minLength(1),
    todo: vine.string().minLength(1),
    done: vine.boolean()
  }))

  const validatedSchema: Todo[] = await vine.validate({ schema, data: todos })
  const usedIds = new Set<string>()
  validatedSchema.forEach(todo => {
    if (usedIds.has(todo.id)) {
      throw new Error('Duplicate id')
    }
    usedIds.add(todo.id)
  })
  return validatedSchema
}
