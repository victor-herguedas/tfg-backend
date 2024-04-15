import express, { type Request, type Response } from 'express'
import chalk from 'chalk'
import { SERVER_PORT } from './utilities/environment.js'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world')
})

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`)
})
