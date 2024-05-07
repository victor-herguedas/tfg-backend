export class OpenAiApiError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'OpenAiApiError'
  }
}

export const OpenAiApiErrorType = 'OpenAiApiError'

export const openAiAPiErrorMessage = (apiService: string): string => { return `Error conecting with ${apiService}` }
