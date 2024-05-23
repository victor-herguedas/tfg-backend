import { Router } from 'express'
import { authMiddleware } from '../../../../middlewares/authMiddleware/authMiddleware.js'
import { createMeetingPost } from '../controllers/createMeetingController/createMeetingController.js'
import { errorHandlerMiddleware } from '../../../../middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', authMiddleware, createMeetingPost)

router.use(errorHandlerMiddleware)

export const meetingsRoutes = router
