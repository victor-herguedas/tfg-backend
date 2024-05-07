import { describe, test, beforeEach, expect, vi, afterEach } from 'vitest'
import { type FormFile, checkIsCorrectFileMimeType, checkIsCorrectFileSize, getAudioFileFromRequest } from './audioSerialization.js'
import { NotSupportedFileTypeError } from '../errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { NotSupportedFileSizeError } from '../errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'
import { type Request } from 'express'
import { ParsingError } from '../errors/ParsingError/ParsingError.js'
import { MissingFileError } from '../errors/MissingFileError/MissingFileError.js'

let motherFile: FormFile

const mocks = vi.hoisted(() => {
  return {
    parseMockFun: vi.fn()
  }
})

vi.mock('formidable', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const original = await importOriginal<typeof import('formidable')>()
  return ({
    ...original,
    default: () => ({
      parse: mocks.parseMockFun
    })
  })
})

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

describe('getAudioFileFromRequest', () => {
  afterEach(() => {
    mocks.parseMockFun.mockClear()
  })

  test('should reject if form.parse returns an error', async () => {
    // eslint-disable-next-line n/no-callback-literal
    mocks.parseMockFun.mockImplementation((req, callback) => { callback(true, {}, {}) })

    await expect(getAudioFileFromRequest({} as unknown as Request)).rejects.toThrowError(ParsingError)
    expect(mocks.parseMockFun).toBeCalledTimes(1)
  })

  test('should reject if no audio file is found', async () => {
    // eslint-disable-next-line n/no-callback-literal
    mocks.parseMockFun.mockImplementation((req, callback) => { callback(null, {}, { audio: [] }) })

    await expect(getAudioFileFromRequest({} as unknown as Request)).rejects.toThrowError(MissingFileError)
    expect(mocks.parseMockFun).toBeCalledTimes(1)
  })

  test('should resolve with the audio file if it is found', async () => {
    const audioFile: FormFile = {
      size: 10,
      filepath: 'string',
      newFilename: 'string',
      mimetype: 'string',
      mtime: new Date(),
      originalFilename: 'string'
    }

    // eslint-disable-next-line n/no-callback-literal
    mocks.parseMockFun.mockImplementation((req, callback) => { callback(null, {}, { audio: [audioFile] }) })

    const audio = await getAudioFileFromRequest({} as unknown as Request)
    expect(mocks.parseMockFun).toBeCalledTimes(1)
    expect(audio).toBe(audioFile)
  })
})
