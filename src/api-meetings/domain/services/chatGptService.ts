import { MEETING_SHORT_SUMMARY_PROMPT, MEETING_SUMMARY_PROMPT, PAID_TEST } from '../../../utilities/environment.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { openAiSession } from '../../../utilities/openAI/openAi.js'
import { type Message } from '../models/Chat.js'
import { type ChatCompletionMessageParam } from 'openai/src/resources/index.js'

export const generateAISummaryService = async (transcription: string): Promise<string> => {
  if (PAID_TEST) {
    try {
      const completion = await openAiSession.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: MEETING_SUMMARY_PROMPT
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

export const generateAIChatResponseService = async (messages: Message[]): Promise<string> => {
  if (messages.length === 0) {
    throw new Error('Messages array is empty')
  }
  if (PAID_TEST) {
    try {
      const completion = await openAiSession.chat.completions.create({
        model: 'gpt-4o',
        messages: messages.map(message => {
          return {
            role: message.role,
            content: message.text
          }
        }) as unknown as ChatCompletionMessageParam[]
      })

      const summary = completion.choices[0].message.content
      if (summary === null) throw new Error('Summary is null')
      return summary
    } catch (e: any) {
      throw new OpenAiApiError('chatGpt4o: ' + e.message as unknown as string)
    }
  } else {
    return 'This is a placeholder for the paid test.'
  }
}

export const generateAIShortSummaryService = async (summary: string): Promise<string> => {
  if (PAID_TEST) {
    try {
      const completion = await openAiSession.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: MEETING_SHORT_SUMMARY_PROMPT
          },
          {
            role: 'user',
            content: summary
          }
        ]
      })

      const result = completion.choices[0].message.content
      if (result === null) throw new Error('Summary is null')
      return result
    } catch (e: any) {
      throw new OpenAiApiError('chatGpt4o: ' + e.message as unknown as string)
    }
  } else {
    if (summary === null) throw new Error('Transcription is null')
    return 'This is a placeholder for the paid test.'
  }
}
