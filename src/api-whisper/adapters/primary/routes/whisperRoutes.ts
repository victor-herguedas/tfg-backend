import { Router } from 'express'
import { postWhisper } from '../controllers/postWhisperController.js'
import { errorHandlerMiddleware } from '../../../../middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'

const router = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', postWhisper)

// TODO
// Test unitarios por funcion
// Pasarlo al controlador
// Crear un socker mientras se está procesando con un observer
// Almacenar en base de datos
// Crar una base de datos mongodb para almacenar los textos generados
router.use(errorHandlerMiddleware)

export const whisperRoutes = router
