import { type NextFunction, type Request, type Response } from 'express'
import { getCreateMeetingDto } from '../dtos/createMeetingDto.js'
import { User } from '../../../../api-auth/domain/models/User.js'
import { createMeetingHandler } from '../../../domain/handlers/createMeetingHandler.js'

export const createMeetingPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const createMeetingDto = await getCreateMeetingDto(req)
    const meeting = await createMeetingHandler(createMeetingDto, authUser)
    res.status(202).json(meeting)
  } catch (e) {
    next(e)
  }
}
