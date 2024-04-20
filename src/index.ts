import express, { type Request, type Response } from 'express'
import chalk from 'chalk'
import { SERVER_PORT } from './utilities/environment.js'
import { whisperRoutes } from './routes/whisper/whisperRoutes.js'
import formidable from 'formidable'

const app = express()

app.use('/whisper/', whisperRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `)
})

app.post('/api/upload', (req, res, next) => {
  console.log('llegamos')
  const form = formidable({})

  form.parse(req, (err: boolean, fields, files) => {
    if (err) {
      console.log(err)
      next(err)
      return
    }
    res.json({ fields, files })
  })
})

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${chalk.blue(`http://localhost:${SERVER_PORT}`)}`)
})

export default app
