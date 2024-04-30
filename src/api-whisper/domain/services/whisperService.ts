import fs from 'fs'
import { openAiSession } from '../../../utilities/openAI/openAi.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'

export const whisperTranscribe = async (filePath: string): Promise<string> => {
  try {
    console.log(filePath)
    const transcription = await openAiSession.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1'
    })
    return transcription.text
  } catch (e: any) {
    // throw new OpenAiApiError('whisper')
    throw new OpenAiApiError('whisper' + e.message as unknown as string)
  }
}
