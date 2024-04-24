import { Router } from 'express'
import { postWhisper } from '../controllers/postWhisperController.js'

const router = Router()

router.post('/', postWhisper)

// TODO
// Test unitarios por funcion
// Pasarlo al controlador
// LLamar a la API de chatGPT
// Crear un socker mientras se está procesando con un observer
// Almacenar en base de datos
// Crar una base de datos mongodb para almacenar los textos generados

export const whisperRoutes = router
