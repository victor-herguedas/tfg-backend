import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

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

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)
export const MEDIA_PATH = path.join(dirName, '..', '..', 'media')

const jwtSecret = process.env.JWT_SECRET
if (jwtSecret === undefined) throw new Error(envExceptionError('JWT_SECRET'))
export const JWT_SECRET = jwtSecret

const jwtExpiresIn = process.env.JWT_EXPIRES_IN
if (jwtExpiresIn === undefined) throw new Error(envExceptionError('JWT_EXPIRES_IN'))
export const JWT_EXPIRES_IN = jwtExpiresIn

const mongoUri = process.env.MONGO_URI
if (mongoUri === undefined) throw new Error(envExceptionError('MONGO_URI'))
export const MONGO_URI = mongoUri

const mongoDbName = process.env.MONGO_DB_NAME
if (mongoDbName === undefined) throw new Error(envExceptionError('MONGO_DB_NAME'))
export const MONGO_DB_NAME = mongoDbName
