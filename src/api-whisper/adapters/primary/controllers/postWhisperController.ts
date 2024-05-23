import { getAudioAndFieldsFromFromRequest } from '../../../../utilities/serializations/audioSerialization.js'
import { whisperTranscribe } from '../../../domain/services/whisperService.js'
import { type NextFunction, type Request, type Response } from 'express'

export const postWhisper = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const audio = (await getAudioAndFieldsFromFromRequest(req)).audio
    const transcription = await whisperTranscribe(audio.filepath)
    return res.status(201).json({ transcription })
  } catch (e) {
    next(e)
  }
}
