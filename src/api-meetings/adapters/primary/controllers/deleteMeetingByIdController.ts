import { type Request, type Response, type NextFunction } from 'express'
import { User } from '../../../../api-auth/domain/models/User.js'
import { deleteMeetingByIdHandler } from '../../../domain/handlers/deleteMeetingByIdHandler.js'

export const deleteMeetingByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUserId = User.getUserFromAnyObject(req.body.user).id
    const meetingToDeleteId = req.params.id
    await deleteMeetingByIdHandler(meetingToDeleteId, authUserId)
    res.status(200).send()
  } catch (error) {
    next(error)
  }
}
