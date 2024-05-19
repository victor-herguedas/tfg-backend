import { Router } from 'express'
import { createMeetingPost } from '../controllers/createMeetingController/createMeetingController.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', createMeetingPost)

export const meetingsRoutes = router
