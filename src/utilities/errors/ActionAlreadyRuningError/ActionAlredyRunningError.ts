export class ActionAlreadyRunningError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ActionAlreadyRunningError'
  }
}

export const getActionAlreadyRunningErrorMessage = (action: string): string => {
  return `${action} is already running.}`
}
