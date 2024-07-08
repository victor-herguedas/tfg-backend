import { type NextFunction, type Request, type Response } from 'express'
import { createSummaryHandler } from '../../../domain/handlers/createSummaryHandler.js'
import { User } from '../../../../api-auth/domain/models/User.js'

export const createSummaryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authUserId = User.getUserFromAnyObject(req.body.user).id
    const meetingId = req.params.id
    const summary = await createSummaryHandler(meetingId, authUserId).catch(next)
    res.status(201).send({ summary })
  } catch (error) {
    next(error)
  }
}

// test de que entra en profundidad y no lo devuelve antes de tiempo
// Test de que se crean los summarys
