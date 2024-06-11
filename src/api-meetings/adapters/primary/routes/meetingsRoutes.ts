import { Router } from 'express'
import { authMiddleware } from '../../../../middlewares/authMiddleware/authMiddleware.js'
import { createMeetingPost as createMeetingController } from '../controllers/createMeetingController.js'
import { errorHandlerMiddleware } from '../../../../middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'
import { findMeetingsController } from '../controllers/findMeetingsController.js'
import { findMeetingByIdController } from '../controllers/findMeetingByIdController.js'
import { deleteMeetingByIdController } from '../controllers/deleteMeetingByIdController.js'
import { createSummaryController } from '../controllers/createSummaryController.js'
import { createChatController } from '../controllers/createChatController.js'
import { addChatQuestionController } from '../controllers/addChatQuestionController.js'
import { findChatController } from '../controllers/findChatController.js'
import { findChatsSummarizedController } from '../controllers/findChatsController.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', authMiddleware, createMeetingController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id', authMiddleware, findMeetingByIdController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', authMiddleware, findMeetingsController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/:id', authMiddleware, deleteMeetingByIdController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/:id/summary', authMiddleware, createSummaryController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/:id/chats', authMiddleware, createChatController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/:id/chats/:chatId', authMiddleware, addChatQuestionController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id/chats/:chatId', authMiddleware, findChatController)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id/chats', authMiddleware, findChatsSummarizedController)

router.use(errorHandlerMiddleware)

export const meetingsRoutes = router
