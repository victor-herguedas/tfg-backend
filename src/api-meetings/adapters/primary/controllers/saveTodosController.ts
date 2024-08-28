import { type NextFunction, type Request, type Response } from 'express'
import { getSaveTodosDto } from '../dtos/saveTodosDTO.js'
import { User } from '../../../../api-auth/domain/models/User.js'
import { saveTodosHandler } from '../../../domain/handlers/saveTodosHandler.js'

export const saveTodosController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = User.getUserFromAnyObject(req.body.user)
    const saveTodosDTO = await getSaveTodosDto(req)
    await saveTodosHandler(saveTodosDTO, user.id)
    res.status(201).send()
  } catch (error) {
    next(error)
  }
}
