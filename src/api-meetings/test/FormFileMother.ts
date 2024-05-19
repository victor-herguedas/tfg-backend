import { type FormFile } from '../../utilities/serializations/audioSerialization.js'

interface Params {
  size?: number
  filepath?: string
  newFilename?: string
  mimetype?: string
  mtime?: Date
  originalFilename?: string
}

export const getFormFileMother = ({
  size = 1000,
  filepath = 'path/to/file',
  newFilename = 'newFilename',
  mimetype = 'audio/mpeg',
  mtime = new Date('2002-06-22'),
  originalFilename = 'originalFilename'
}: Params): FormFile => {
  return {
    size,
    filepath,
    newFilename,
    mimetype,
    mtime,
    originalFilename
  }
}
