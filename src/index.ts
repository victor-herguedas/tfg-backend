import express from 'express'
import chalk from 'chalk'
import { SERVER_PORT } from './utilities/environment.js'
import { whisperRoutes } from './api-whisper/adapters/primary/routes/whisperRoutes.js'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'

const app = express()

app.use('/whisper/', whisperRoutes)

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`)
})

export default app

app.use(errorHandlerMiddleware)
