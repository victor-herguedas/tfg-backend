import { getValidatedAudioFromFileFromRequest } from '@/utilities/serializations/audioSerialization.js'
import { type NextFunction, type Request, type Response } from 'express'

export const postWhisper = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const audio = await getValidatedAudioFromFileFromRequest(req)
    return res.status(201).send(audio.newFilename)
  } catch (e) {
    return res.status(400).send()
  }
}
