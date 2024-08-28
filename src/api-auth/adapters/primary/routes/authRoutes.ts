import { Router } from 'express'
import { loginPost, registerPost } from '../controllers/authController.js'
import { errorHandlerMiddleware } from '../../../../middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'
import { authMiddleware } from '../../../../middlewares/authMiddleware/authMiddleware.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/register', registerPost)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', loginPost)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/me', authMiddleware, (req, res) => { res.status(200).send() })

router.use(errorHandlerMiddleware)

export const authRoutes = router
