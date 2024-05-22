import { type NextFunction, type Request, type Response } from 'express'
import { getCreateMeetingDto } from '../../dtos/createMeetingDto.js'

export const createMeetingPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req)
    const createMeetingDto = await getCreateMeetingDto(req)
    res.send(202)
  } catch (error) {
    next(error)
  }
}
