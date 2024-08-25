export class EmailAlreadyExistError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'EmailAlreadyExistError'
  }
}

export const getEmailAlreadyExistErrorMessage = (emailName: string): string => {
  return `${emailName} already in use`
}
