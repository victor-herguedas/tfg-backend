import { describe, expect, test } from 'vitest'
import { formatTodosService } from './validateTodosService.js'

describe('validateTodosService', () => {
  const formateableTodo1 = [
    {
      id: '1',
      todo: 'test',
      done: false
    },
    {
      id: '2',
      todo: 'test2',
      done: true
    }
  ]

  const formateableTodo2 = [
    {
      id: '1',
      todo: 'test',
      done: false
    },
    {
      id: '2',
      todo: 'test2',
      done: true,
      hello: ''
    }
  ]

  const invalidTodo1 = [
    {
      id: 1,
      todo: 'test',
      done: false
    },
    {
      id: 2,
      names: 'test2',
      done: true
    }
  ]

  const invalidTodo2 = [
    {
      id: 1,
      name: 'test',
      completed: false
    },
    {
      id: 1,
      names: 'test2',
      completed: true,
      hello: ''
    }
  ]

  const invalidTodo3 = [
    {
      id: 1,
      todo: 'test',
      done: false
    },
    {
      id: 1,
      todo: 'test',
      done: true
    }
  ]

  const invalidTodo4 = [
    {
      id: 1,
      name: 'test',
      completed: false
    },
    {
      id: 2,
      names: 'test2',
      completed: true,
      hello: ''
    }
  ]

  test('should throw an error if not correct todos', async () => {
    await expect(formatTodosService(invalidTodo1)).rejects.toThrowError()
    await expect(formatTodosService(invalidTodo2)).rejects.toThrowError()
    await expect(formatTodosService(invalidTodo3)).rejects.toThrowError()
    await expect(formatTodosService(invalidTodo4)).rejects.toThrowError()
  })

  test('should return a validated todo', async () => {
    await formatTodosService(formateableTodo1)
    await formatTodosService(formateableTodo2)
  })
})
