import { Router } from 'express'
import { loginPost, registerPost } from '../controllers/authController.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/register', registerPost)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', loginPost)

export const authRoutes = router
