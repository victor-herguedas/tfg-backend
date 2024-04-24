import { type Request } from 'express'
import formidable from 'formidable'

export interface FormFile {
  size: number
  filepath: string
  newFilename: string
  mimetype: string
  mtime: Date
  originalFilename: string
}

export const getValidatedAudioFromFileFromRequest = async (req: Request): Promise<FormFile> => {
  const audio = await getAudioFileFromRequest(req)
  checkIsCorrectFileSize(audio)
  checkIsCorrectFileMimeType(audio)
  return audio
}

export const checkIsCorrectFileMimeType = (file: FormFile): void => {
  // Lista de MIME types permitidos
  const allowedMimeTypes = [
    'audio/mpeg', // para mp3 y mpeg
    'audio/mp4', // para mp4, m4a
    'audio/x-wav', // para wav
    'audio/webm', // para webm
    'audio/mpga' // para mpga
  ]

  // Validar que el formato del archivo esté permitido
  if (!allowedMimeTypes.includes(file.mimetype)) throw new Error()
}

export const checkIsCorrectFileSize = (file: FormFile): void => {
  // Validar que el tamaño del archivo no sea mayor a 25 MB
  if (file.size >= (25 * 1024 * 1024)) throw new Error()
}

export const getAudioFileFromRequest = async (req: Request): Promise<FormFile> => {
  const form = formidable({})
  return await new Promise((resolve, reject) => {
    form.parse(req, (err: boolean, fields, files) => {
      if (err) {
        reject(new Error('Error parsing the form.'))
      }
      const audios: FormFile[] = files.audio as FormFile[]
      if (audios === undefined || audios.length === 0) {
        reject(new Error('No audio file found.'))
      } else {
        resolve(audios[0])
      }
    })
  })
}
