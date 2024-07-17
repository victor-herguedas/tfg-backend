import { MEETING_SUMMARY_PROMPT, PROMPT_FOR_GENERATE_IMAGE_PROMPT, USE_REAL_AI_API } from '../../../utilities/environment.js'
import { OpenAiApiError } from '../../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { openAiSession } from '../../../utilities/openAI/openAi.js'
import { type Message } from '../models/Chat.js'
import { type ChatCompletionMessageParam } from 'openai/src/resources/index.js'

export const generateAIChatResponseService = async (messages: Message[]): Promise<string> => {
  if (messages.length === 0) {
    throw new Error('Messages array is empty')
  }
  if (USE_REAL_AI_API) {
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

export const generateAISummaryService = async (text: string): Promise<string> => {
  if (USE_REAL_AI_API) {
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
            content: text
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
    if (text === null) throw new Error('Transcription is null')
    return 'This is a placeholder for the paid test.'
  }
}

export const generateAIImage = async (prompt: string): Promise<string> => {
  if (USE_REAL_AI_API) {
    try {
      const optiimizedPrompt = await generatePromptForImagegeneration(prompt)
      const response = await openAiSession.images.generate({
        model: 'dall-e-3',
        prompt: optiimizedPrompt,
        n: 1,
        size: '1792x1024'
      })

      const result = response.data[0].url
      if (result === undefined) throw new Error('URL is null')
      return result
    } catch (e: any) {
      throw new OpenAiApiError('chatGpt4o: ' + e.message as unknown as string)
    }
  } else {
    if (prompt === null) throw new Error('Prompt is null')
    return 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'
  }
}

const generatePromptForImagegeneration = async (initialText: string): Promise<string> => {
  if (USE_REAL_AI_API) {
    const completion = await openAiSession.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: PROMPT_FOR_GENERATE_IMAGE_PROMPT
        },
        {
          role: 'user',
          content: initialText
        }
      ]
    })

    const result = completion.choices[0].message.content
    if (result === null) throw new Error('prompt generated is null')
    return result
  } else {
    return 'This is a placeholder for a image generation prompt.'
  }
}
