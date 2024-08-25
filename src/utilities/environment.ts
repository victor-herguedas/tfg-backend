import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const envExceptionError = (envVariable: string): string => {
  return `${envVariable} not defined`
}

const serverPort = process.env.SERVER_PORT
if (serverPort === undefined) throw new Error(envExceptionError('SERVER_PORT'))
export const SERVER_PORT = serverPort

const openAiApiKey = process.env.OPENAI_API_KEY
if (openAiApiKey === undefined) throw new Error(envExceptionError('OPENAI_API_KEY'))
export const OPENAI_API_KEY = openAiApiKey

const useRealAiApi = process.env.USE_REAL_AI_API
if (useRealAiApi === undefined) throw new Error(envExceptionError('USE_REAL_AI_API'))
export const USE_REAL_AI_API: boolean = useRealAiApi === 'true'

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

const meetingChatPrompt = process.env.MEETING_CHAT_PROMPT
if (meetingChatPrompt === undefined) throw new Error(envExceptionError('MEETING_CHAT_PROMPT'))
export const MEETING_CHAT_PROMPT = meetingChatPrompt

const maxQuestionLength = process.env.MAX_QUESTION_LENGTH
if (maxQuestionLength === undefined) throw new Error(envExceptionError('MAX_QUESTION_LENGTH'))
export const MAX_QUESTION_LENGTH = parseInt(maxQuestionLength)

const meetingSummaryPrompt = process.env.MEETING_SUMMARY_PROMPT
if (meetingSummaryPrompt === undefined) throw new Error(envExceptionError('MEETING_SUMMARY_PROMPT'))
export const MEETING_SUMMARY_PROMPT = meetingSummaryPrompt

const s3BucketName = process.env.S3_BUCKET_NAME
if (s3BucketName === undefined) throw new Error(envExceptionError('S3_BUCKET_NAME'))
export const S3_BUCKET_NAME = s3BucketName

const s3BucketRegion = process.env.S3_BUCKET_REGION
if (s3BucketRegion === undefined) throw new Error(envExceptionError('S3_BUCKET_REGION'))
export const S3_BUCKET_REGION = s3BucketRegion

const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID
if (s3AccessKeyId === undefined) throw new Error(envExceptionError('S3_ACCESS_KEY_ID'))
export const S3_ACCESS_KEY_ID = s3AccessKeyId

const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY
if (s3SecretAccessKey === undefined) throw new Error(envExceptionError('S3_SECRET_ACCESS_KEY'))
export const S3_SECRET_ACCESS_KEY = s3SecretAccessKey

const useRealS3Api = process.env.USE_REAL_S3_API
if (useRealS3Api === undefined) throw new Error(envExceptionError('USE_REAL_S3_API'))
export const USE_REAL_S3_API: boolean = useRealS3Api === 'true'

const generateImagePrompt = process.env.GENERATE_IMAGE_PROMPT
if (generateImagePrompt === undefined) throw new Error(envExceptionError('GENERATE_IMAGE_PROMPT'))
export const GENERATE_IMAGE_PROMPT = generateImagePrompt

const extractTodosPrompt = process.env.EXTRACT_TODOS_PROMPT
if (extractTodosPrompt === undefined) throw new Error(envExceptionError('EXTRACT_TODOS_PROMPT'))
export const EXTRACT_TODOS_PROMPT = extractTodosPrompt

const registerCode = process.env.REGISTER_CODE
if (registerCode === undefined) throw new Error(envExceptionError('REGISTER_CODE'))
export const REGISTER_CODE = registerCode
