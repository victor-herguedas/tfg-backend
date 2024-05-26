import { type NextFunction, type Request, type Response } from 'express'

export const createSummaryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(202).send()
  } catch (error) {
    next(error)
  }
}
