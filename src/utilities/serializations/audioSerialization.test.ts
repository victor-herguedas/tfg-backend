import { describe, test, beforeEach, expect } from 'vitest'
import { type FormFile, checkIsCorrectFileMimeType, checkIsCorrectFileSize } from './audioSerialization.js'
import { NotSupportedFileTypeError } from '../errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { NotSupportedFileSizeError } from '../errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'
// import { type Request } from 'express'
// import formidable from 'formidable'
// import formidable from 'formidable'
// import { getAudioFileFromRequest } from './audioSerialization.js'

let motherFile: FormFile

beforeEach(() => {
  motherFile = {
    size: 10,
    filepath: 'string',
    newFilename: 'string',
    mimetype: 'string',
    mtime: new Date(),
    originalFilename: 'string'
  }
})

describe('checkIsCorrectFileMimeType', () => {
  test('it accepts mp3 audio', () => {
    const file = motherFile
    file.mimetype = 'audio/mpeg'

    checkIsCorrectFileMimeType(file)
  })

  test('it dont accept pdf files', () => {
    const file = motherFile
    file.mimetype = 'application/pdf'

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(() => checkIsCorrectFileMimeType(file)).toThrowError(NotSupportedFileTypeError)
  })
})

describe('checkIsCorrectFileSize', () => {
  test('it accepts files lower  than 25 mb', () => {
    const file = motherFile
    file.size = 25 * 1024 * 1023

    checkIsCorrectFileSize(file)
  })

  test('it dont accept files higher than 25 mb', () => {
    const file = motherFile
    file.size = 25 * 1024 * 1026
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(() => checkIsCorrectFileSize(file)).toThrowError(NotSupportedFileSizeError)
  })
})

// describe('getAudioFileFromRequest', () => {
// vi.doMock('formidable', () => ({
//   default: vi.fn(() => ({
//     parse: vi.fn((req, callback) => { callback(true, {}, {}) }) // Configuramos la función parse como un mock genérico aquí
//   }))
// }))

// test('should reject if form.parse returns an error', async () => {
//   const mockRequest = {} as unknown as Request
//   vi.spyOn(formidable, 'formidable').mockImplementation((originalFile) => {
//     return (
//       {
//         ...originalFile()
//       }
//     )
//   })
//   mockForm.parse = vi.fn((req, callback) => { callback(true, {}, {}) }) // Configuramos el mock específico aquí

//   await expect(getAudioFileFromRequest(mockRequest)).rejects.toThrow('Error parsing the form.')
// })

// test('should reject if no audio file is found', async () => {
//   const mockRequest = {} as Request
//   const mockForm = formidable()
//   mockForm.parse = vi.fn((req, callback) => { callback(null, {}, { audio: [] }) })

//   await expect(getAudioFileFromRequest(mockRequest)).rejects.toThrow('No audio file found.')
// })

// test('should resolve with the audio file if it is found', async () => {
//   const mockRequest = {} as Request
//   const expectedFile = new File([''], 'audio.mp3')
//   const mockForm = formidable()
//   mockForm.parse = vi.fn((req, callback) => { callback(null, {}, { audio: [expectedFile] }) })

//   const result = await getAudioFileFromRequest(mockRequest)
//   expect(result).toBe(expectedFile)
// })
// })
