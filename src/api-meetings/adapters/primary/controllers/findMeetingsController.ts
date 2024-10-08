import { type NextFunction, type Request, type Response } from 'express'
import { User } from '../../../../api-auth/domain/models/User.js'
import { findMeetingsHandler } from '../../../domain/handlers/findMeetingsHandler.js'
import { FindMeetingsResponse } from '../dtos/findMeetingsResponse.js'
import { getFindMeetingDto } from '../dtos/findMeetingDTO.js'

export const findMeetingsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const findMeetingDTO = await getFindMeetingDto(req)
    const meetings = await findMeetingsHandler(authUser.id, findMeetingDTO.name)
    const meetingsResponse = new FindMeetingsResponse(meetings).meetings
    res.status(200).send(meetingsResponse)
  } catch (error) {
    next(error)
  }
}
