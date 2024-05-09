import express from 'express'
import chalk from 'chalk'
import { SERVER_PORT } from './utilities/environment.js'
import { whisperRoutes } from './api-whisper/adapters/primary/routes/whisperRoutes.js'
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware/errorHandlerMiddleware.js'
import { authRoutes } from './api-auth/adapters/primary/routes/authRoutes.js'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/whisper/', whisperRoutes)
app.use('/auth/', authRoutes)

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`)
})

export default app

app.use(errorHandlerMiddleware)
