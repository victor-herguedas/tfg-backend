import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { Stream } from 'stream'
import crypto from 'crypto'
const pipeline = promisify(Stream.pipeline)

export const downloadImageService = async (imageUrl: string, downloadPath: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}: ${response.statusText}`)
    }

    const savedFilePath = downloadPath + '/' + crypto.randomUUID() + '.jpg'
    const directory = path.dirname(savedFilePath)

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    const readableStream = response.body as unknown as ReadableStream
    await pipeline(readableStream, fs.createWriteStream(savedFilePath))

    console.log(`Image downloaded and saved to ${savedFilePath}`)
    return savedFilePath
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const downloadImageToBufferService = async (imageUrl: string): Promise<Buffer> => {
  try {
    const filePath = await downloadImageService(imageUrl, '/tmp')
    const buffer = fs.readFileSync(filePath)
    fs.unlinkSync(filePath)
    return buffer
  } catch (error) {
    console.log(error)
    throw error
  }
}
