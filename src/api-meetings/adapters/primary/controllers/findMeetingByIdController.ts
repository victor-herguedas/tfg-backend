import { type NextFunction, type Request, type Response } from 'express'
import { findMeetingByIdHandler } from '../../../domain/handlers/findMeetingByIDHandler.js'
import { User } from '../../../../api-auth/domain/models/User.js'

export const findMeetingByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const meetingId = req.params.id
    const meeting = await findMeetingByIdHandler(meetingId, authUser.id)
    res.status(200).send(meeting)
  } catch (error) {
    next(error)
  }
}
