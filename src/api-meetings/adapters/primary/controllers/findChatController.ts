import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../../../../api-auth/domain/models/User.js'
import { findChatByIdHandler } from '../../../domain/handlers/findChatByIdHandler.js'

export const findChatController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const meetingId = req.params.id
    const chatId = req.params.chatId
    const chat = await findChatByIdHandler(authUser.id, meetingId, chatId)
    res.status(200).json({ chat })
  } catch (error) {
    next(error)
  }
}
