import fs from 'fs'
import { openAiSession } from '@/utilities/openAI/openAi.js'

export const whisperTranscribe = async (filePath: string): Promise<string> => {
  const transcription = await openAiSession.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1'
  })
  return transcription.text
}
