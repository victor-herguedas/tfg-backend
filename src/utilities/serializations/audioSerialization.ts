import { type Request } from 'express'
import formidable from 'formidable'
import { NotSupportedFileTypeError, notSupportedFileTypeErrorMessage } from '../errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { NotSupportedFileSizeError, notSupportedFileSizeErrorMessage } from '../errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'
import { MissingFileError, missingFileErrorMessage } from '../errors/MissingFileError/MissingFileError.js'
import { ParsingError, parsingErrorMessage } from '../errors/ParsingError/ParsingError.js'
import path from 'path'
import fs from 'fs'
import { ValidationError, getValidationErrorMessage } from '../errors/ValidationError/ValidationError.js'

export interface FormFile {
  size: number
  filepath: string
  newFilename: string
  mimetype: string
  mtime: Date
  originalFilename: string
}

interface AudioAndFields {
  audio: FormFile
  fields: any
}

export const getAudioAndFieldsFromFromRequest = async (req: Request): Promise<AudioAndFields> => {
  const audioAndFields = await extractAudioAndFieldsFromRequest(req)
  const audio = audioAndFields.audio
  checkIsCorrectFileSize(audio)
  checkIsCorrectFileMimeType(audio)
  renameFileWithExtension(audio)
  return { audio, fields: audioAndFields.fields }
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

  const mimetype = file.mimetype

  // Validar que el formato del archivo esté permitido
  if (!allowedMimeTypes.includes(mimetype)) throw new NotSupportedFileTypeError(notSupportedFileTypeErrorMessage(mimetype, allowedMimeTypes))
}

export const renameFileWithExtension = (file: FormFile): void => {
  // Mapeo de MIME types a extensiones de archivo para audio
  const extensionMap: Record<string, string> = {
    'audio/mpeg': '.mp3',
    'audio/mp4': '.mp4',
    'audio/x-wav': '.wav',
    'audio/webm': '.webm',
    'audio/mpga': '.mpga'
  }
  // Si el archivo tiene ya una extensión, no hacer nada
  if (path.extname(file.originalFilename) !== '') return

  // Extraer la extensión basada en el mimetype del archivo
  const extension = extensionMap[file.mimetype]

  if (extension === undefined) {
    throw new NotSupportedFileSizeError('unknown')
  }
  const fileNameWithExtension = `${file.newFilename}${extension}`

  const directoryPath = path.dirname(file.filepath)
  const newFilePath = path.join(directoryPath, fileNameWithExtension)

  renameFile(file, newFilePath)
}

export const renameFile = (file: FormFile, newFilePath: string): void => {
  const fileName = file.originalFilename
  try {
    fs.renameSync(file.filepath, newFilePath)
  } catch (e: any) {
    throw new ParsingError(parsingErrorMessage(fileName))
  }
  file.filepath = newFilePath
}

export const checkIsCorrectFileSize = (file: FormFile): void => {
  // Validar que el tamaño del archivo no sea mayor a 25 MB
  const fileSize = file.size
  const maxFileSize = 25 * 1024 * 1024
  if (fileSize >= (maxFileSize)) throw new NotSupportedFileSizeError(notSupportedFileSizeErrorMessage(fileSize.toString(), maxFileSize.toString()))
}

export const extractAudioAndFieldsFromRequest = async (req: Request): Promise<AudioAndFields> => {
  const form = formidable({})
  return await new Promise((resolve, reject) => {
    if (req.is('multipart/form-data') === false) {
      reject(new ValidationError(getValidationErrorMessage('audio', 'Body content should be multipart/form-data.')))
    }
    form.parse(req, (err: boolean, fields, files) => {
      if (err) {
        reject(new ParsingError(parsingErrorMessage('audio')))
      }
      const audios: FormFile[] = files.audio as FormFile[]
      if (audios === undefined || audios.length === 0) {
        reject(new MissingFileError(missingFileErrorMessage('audio')))
      } else {
        resolve({ audio: audios[0], fields })
      }
    })
  })
}
