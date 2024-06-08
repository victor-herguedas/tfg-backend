import { type NextFunction, type Request, type Response } from 'express'
import { getAddChatQuestionDto as getAddChatQuestionDTO } from '../dtos/addChatQuestionDTO.js'
import { addChatQuestionHandler } from '../../../domain/handlers/addChatQuestionHandler.js'
import { User } from '../../../../api-auth/domain/models/User.js'

export const addChatQuestionController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUser = User.getUserFromAnyObject(req.body.user)
    const addChatQuestionDTO = await getAddChatQuestionDTO(req)
    const chat = await addChatQuestionHandler(authUser.id, addChatQuestionDTO)
    res.status(202).send(chat)
    next()
  } catch (error) {
    next(error)
  }
}
