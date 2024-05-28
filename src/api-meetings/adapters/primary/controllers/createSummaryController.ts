import { type NextFunction, type Request, type Response } from 'express'
import { createSummaryHandler } from '../../../domain/handlers/createSummaryHandler.js'
import { User } from '../../../../api-auth/domain/models/User.js'

export const createSummaryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUserId = User.getUserFromAnyObject(req.body.user).id
    const meetingId = req.params.meeting
    createSummaryHandler(meetingId, authUserId).catch(next)
    res.status(202).send()
  } catch (error) {
    next(error)
  }
}
