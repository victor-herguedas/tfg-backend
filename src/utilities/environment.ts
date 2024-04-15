import 'dotenv/config'

const envExceptionError = (envVariable: string): string => {
  return `${envVariable} not defined`
}

const serverPort = process.env.SERVER_PORT
if (serverPort === undefined) throw new Error(envExceptionError('SERVER_PORT'))
export const SERVER_PORT = serverPort

const serverName = process.env.SERVER_NAME
if (serverName === undefined) throw new Error(envExceptionError('SERVER_NAME'))
export const SERVER_NAME = serverName
