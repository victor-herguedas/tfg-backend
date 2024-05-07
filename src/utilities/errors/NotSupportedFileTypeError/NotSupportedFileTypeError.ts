export class NotSupportedFileTypeError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NotSupportedFileTypeError'
  }
}

export const NotSupportedFileTypeErrorType = 'NotSupportedFileTypeError'

export const notSupportedFileTypeErrorMessage = (resourceName: string, supportedTypes?: string[]): string => {
  return `${resourceName} is not a supported type. ${supportedTypes === undefined ? '' : `Supported types:${supportedTypes.reduce((acumulator, supportedType, index) => { return (acumulator + ' ' + supportedType + `${index + 1 === supportedTypes.length ? '' : ','}`) }, '')}`
  }`
}
