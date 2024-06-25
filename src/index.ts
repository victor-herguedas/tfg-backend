import express from 'express'
import chalk from 'chalk'
import { SERVER_PORT } from './utilities/environment.js'
import { whisperRoutes } from './api-whisper/adapters/primary/routes/whisperRoutes.js'
import { authRoutes } from './api-auth/adapters/primary/routes/authRoutes.js'
import bodyParser from 'body-parser'
import { meetingsRoutes } from './api-meetings/adapters/primary/routes/meetingsRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express()
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/whisper/', whisperRoutes)
app.use('/auth/', authRoutes)
app.use('/meetings/', meetingsRoutes)

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`)
})

export default app
