import { Router } from 'express'
import { registerPost } from '../controllers/authController.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/register', registerPost)

export const authRoutes = router
