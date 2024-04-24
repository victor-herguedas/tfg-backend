import 'dotenv/config'
import path from 'path'

const envExceptionError = (envVariable: string): string => {
  return `${envVariable} not defined`
}

const serverPort = process.env.SERVER_PORT
if (serverPort === undefined) throw new Error(envExceptionError('SERVER_PORT'))
export const SERVER_PORT = serverPort

const serverName = process.env.SERVER_NAME
if (serverName === undefined) throw new Error(envExceptionError('SERVER_NAME'))
export const SERVER_NAME = serverName

const openAiApiKey = process.env.OPENAI_API_KEY
if (openAiApiKey === undefined) throw new Error(envExceptionError('OPENAI_API_KEY'))
export const OPENAI_API_KEY = openAiApiKey

const paidTest = process.env.PAID_TEST
if (paidTest === undefined) throw new Error(envExceptionError('PAID_TEST'))
export const PAID_TEST: boolean = paidTest === 'true'

export const MEDIA_PATH = path.join(__dirname, '..', '..', 'media')
