import { type NextFunction, type Request, type Response } from 'express'
import { getCreateMeetingDto } from '../../dtos/createMeetingDto.js'
import { User } from '../../../../../api-auth/domain/models/User.js'
import { createMeetingHandler } from '../../../../domain/handlers/createMeetingHandler.js'

export const createMeetingPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('createMeetingPost')
    const authUser = User.getUserFromAnyObject(req.body.user)
    console.log('auth user')
    const createMeetingDto = await getCreateMeetingDto(req)
    console.log('createMeetingDto')
    const meeting = await createMeetingHandler(createMeetingDto, authUser)
    console.log('meeting')
    res.status(202).json(meeting)
  } catch (e) {
    next(e)
  }
}
