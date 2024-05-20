import fs from 'fs'
import { openAiSession } from '../../../../utilities/openAI/openAi.js'
import { OpenAiApiError } from '../../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { PAID_TEST } from '../../../../utilities/environment.js'

export const whisperTranscribe = async (filePath: string): Promise<string> => {
  if (PAID_TEST) {
    try {
      const transcription = await openAiSession.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1'
      })
      return transcription.text
    } catch (e: any) {
      throw new OpenAiApiError('whisper' + e.message as unknown as string)
    }
  } else {
    return 'This is a placeholder for the paid test.'
  }
}
