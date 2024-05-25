export class NotFoundError extends Error {
  type: string = 'NotFoundError'
  constructor (message: string) {
    super(message)
    this.name = 'NotSupportedFileSizeError'
  }
}
export const getNotFoundErrorMessage = (resource: string): string => {
  return `${resource} not found.`
}
