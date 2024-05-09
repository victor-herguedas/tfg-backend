export class ValidationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const ValidationErrorType = 'ValidationError'

export const getvalidationErrorMessage = (field: string, errorMessage: string): string => {
  return `${field}:${errorMessage}`
}

interface ValidationErrorObject {
  field: string
  message: string
}

export const getValidationErrorObject = (message: string): ValidationErrorObject => {
  const [field, errorMessage] = message.split(':')
  return {
    field,
    message: errorMessage
  }
}
