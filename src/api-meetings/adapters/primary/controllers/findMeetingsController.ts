import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../../../../api-auth/domain/models/User.js'
import { findMeetingsHandler } from '../../../domain/handlers/findMeetingsHandler.js'
import { FindMeetingsResponse } from '../dtos/findMeetingsResponse.js'

export const findMeetingsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authUser = User.getUserFromAnyObject(req.body.user)
  const meetings = await findMeetingsHandler(authUser.id)
  const meetingsResponse = new FindMeetingsResponse(meetings).meetings
  res.status(200).send(meetingsResponse)
}
