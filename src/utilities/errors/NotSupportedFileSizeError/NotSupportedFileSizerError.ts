export class NotSupportedFileSizeError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NotSupportedFileSizeError'
  }
}

export const NotSupportedFileSizeErrorType = 'NotSupportedFileSizeError'

export const notSupportedFileSizeErrorMessage = (fileSize: string, maxFileSize: string): string => {
  return `Imported file size ${fileSize}, max file size${maxFileSize}`
}
