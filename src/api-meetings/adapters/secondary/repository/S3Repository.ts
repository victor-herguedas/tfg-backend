import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { S3_ACCESS_KEY_ID, S3_BUCKET_NAME, S3_BUCKET_REGION, S3_SECRET_ACCESS_KEY } from '../../../../utilities/environment.js'
import crypto from 'crypto'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
  },
  region: S3_BUCKET_REGION
})

export const saveFileS3 = async (file: Buffer, key: null | string = null): Promise<string> => {
  const fileKey = key ?? `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.mp4`
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: file
  }
  const command = new PutObjectCommand(params)

  await s3.send(command)

  return fileKey
}

export const getFileUrlS3 = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 60 })
  return url
}
