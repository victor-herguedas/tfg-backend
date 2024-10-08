import { type NextFunction, type Request, type Response } from 'express'
import { getCreateChatDto } from '../dtos/createChatDto.js'
import { createChatHandler } from '../../../domain/handlers/createChatHandler.js'
import { User } from '../../../../api-auth/domain/models/User.js'

export const createChatController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const createChatDto = await getCreateChatDto(req)
    const chat = await createChatHandler(authUser.id, createChatDto).catch(next)
    res.status(201).send(chat)
  } catch (error) {
    next(error)
  }
}
