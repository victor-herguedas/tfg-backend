export class ResourceAlreadyExistError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ResourceAlreadyExistError'
  }
}

export const getResourceAlreadyExistError = (resource: string): string => {
  return `${resource} already exist.}`
}
