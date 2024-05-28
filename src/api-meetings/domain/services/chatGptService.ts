import { PAID_TEST } from '../../../utilities/environment.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { openAiSession } from '../../../utilities/openAI/openAi.js'

export const generateChatGptSummary = async (transcription: string): Promise<string> => {
  if (PAID_TEST) {
    try {
      const completion = await openAiSession.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points.'
          },
          {
            role: 'user',
            content: transcription
          }
        ]
      })

      const summary = completion.choices[0].message.content
      if (summary === null) throw new Error('Summary is null')
      return summary
    } catch (e: any) {
      throw new OpenAiApiError('chatGpt4o: ' + e.message as unknown as string)
    }
  } else {
    if (transcription === null) throw new Error('Transcription is null')
    return 'This is a placeholder for the paid test.'
  }
}
