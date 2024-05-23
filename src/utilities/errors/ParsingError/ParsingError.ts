export class ParsingError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ParsingError'
  }
}

export const ParsingErrorType = 'ParsingError'

export const getParsingErrorMessage = (parsedName: string, extraInfo?: string): string => {
  return `Error parsing ${parsedName}. ${extraInfo}`
}
