import { Router } from 'express'
import { authMiddleware } from '../../../../middlewares/authMiddleware/authMiddleware.js'
import { createMeetingPost as createMeetingController } from '../controllers/createMeetingController.js'
import { errorHandlerMiddleware } from '../../../../middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'
import { findMeetingsController } from '../controllers/findMeetingsController.js'
import { findMeetingByIdController } from '../controllers/findMeetingByIdController.js'
import { deleteMeetingByIdController } from '../controllers/deleteMeetingByIdController.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', authMiddleware, createMeetingController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id', authMiddleware, findMeetingByIdController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', authMiddleware, findMeetingsController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/:id', authMiddleware, deleteMeetingByIdController)

router.use(errorHandlerMiddleware)

export const meetingsRoutes = router
