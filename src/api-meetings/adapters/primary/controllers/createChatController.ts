import { type NextFunction, type Request, type Response } from 'express'
import { getCreateChatDto } from '../dtos/createChatDto.js'

export const createChatController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createChatDto = await getCreateChatDto(req)
    res.status(202).send()
  } catch (error) {
    next(error)
  }
}
