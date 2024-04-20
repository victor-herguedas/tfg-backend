import { type NextFunction, Router, type Request, type Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

const router = Router()

interface File {
  size: number
  filepath: string
  newFilename: string
  mimetype: string
  mtime: Date
  originalFilename: string
}

router.post('/', (req: Request, res: Response, next) => {
  getMp3File(req, res, next)
})

const getMp3File = (req: Request, res: Response, next: NextFunction): void => {
  const form = formidable({})

  form.parse(req, (err: boolean, fields, files) => {
    if (err) {
      next(err)
      return
    }

    const audios: undefined | File[] = files.audio as unknown as undefined | File[]
    if (audios === undefined) return res.status(400).send('Este')
    if (audios[0] === undefined) return res.status(400).send('oeste')
    const audio = audios[0]

    // Lista de MIME types permitidos
    const allowedMimeTypes = [
      'audio/mpeg', // para mp3 y mpeg
      'audio/mp4', // para mp4, m4a
      'audio/x-wav', // para wav
      'audio/webm', // para webm
      'audio/mpga' // para mpga
    ]

    // Validar que el formato del archivo esté permitido
    if (!allowedMimeTypes.includes(audio.mimetype)) {
      return res.status(400).send('Invalid file format. Supported formats are: mp3, mp4, mpeg, mpga, m4a, wav, webm.')
    }

    // Validar que el tamaño del archivo no sea mayor a 25 MB
    if (audio.size > 25 * 1024 * 1024) {
      return res.status(400).send('File size exceeds the 25 MB limit.')
    }

    const oldPath = audio.filepath
    const rootDir = process.cwd()
    const newPath = path.join(rootDir, 'uploads', '/', audio.originalFilename)
    const rawData = fs.readFileSync(oldPath)
    fs.writeFile(newPath, rawData, (err) => {
      if (err !== undefined) return res.status(500).send()
    })
    return res.status(201).send()
  })
}

export const whisperRoutes = router
