export class MissingFileError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'MissingFileError'
  }
}

export const MissingFileErrorType = 'MissingFileError'

export const getMissingFileErrorMessage = (fileName: string): string => {
  return `Missing file with name ${fileName}.}`
}
