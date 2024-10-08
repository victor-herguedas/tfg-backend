import { describe, expect, test } from 'vitest'
import { getValidationErrorObject, getValidationErrorMessage } from './ValidationError.js'

describe('ValidatingError tests', () => {
  const field = 'correo'
  const errorMessage = 'Invalid email'

  test('should return correct validation error', () => {
    expect(getValidationErrorMessage(field, errorMessage)).toBe(`${field}:${errorMessage}`)
  })

  test('should return correct validation object', () => {
    const message = 'correo:Invalid email'
    const errorObject = {
      field,
      message: errorMessage
    }
    expect(getValidationErrorObject(message)).toEqual(errorObject)
  }
  )
})
