import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../../../../api-auth/domain/models/User.js'
import { findChatsSummarizedHandler } from '../../../domain/handlers/findChatsSummarizedByIdHandler.js'

export const findChatsSummarizedController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const meetingId = req.params.id
    const chats = await findChatsSummarizedHandler(authUser.id, meetingId)
    res.status(200).json(chats)
  } catch (error) {
    next(error)
  }
}
