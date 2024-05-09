import { type Response, type Request, type NextFunction } from 'express'
import { NotSupportedFileTypeError, NotSupportedFileTypeErrorType } from '../../utilities/errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { createResponseBodyError } from '../../utilities/errors/createResponseError.js'
import { NotSupportedFileSizeError, NotSupportedFileSizeErrorType } from '../../utilities/errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'
import { OpenAiApiError, OpenAiApiErrorType } from '../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { MissingFileError, MissingFileErrorType } from '../../utilities/errors/MissingFileError/MissingFileError.js'
import { ParsingError, ParsingErrorType } from '../../utilities/errors/ParsingError/ParsingError.js'
import { ValidationError, ValidationErrorType, getValidationErrorObject } from '../../utilities/errors/ValidationError/ValidationError.js'

export function errorHandlerMiddleware (error: Error, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof NotSupportedFileTypeError) {
    res.status(400).json(createResponseBodyError({ message: error.message, type: NotSupportedFileTypeErrorType }))
  } else if (error instanceof NotSupportedFileSizeError) {
    res.status(400).json(createResponseBodyError({ message: error.message, type: NotSupportedFileSizeErrorType }))
  } else if (error instanceof OpenAiApiError) {
    res.status(500).json(createResponseBodyError({ message: error.message, type: OpenAiApiErrorType }))
  } else if (error instanceof MissingFileError) {
    res.status(400).json(createResponseBodyError({ message: error.message, type: MissingFileErrorType }))
  } else if (error instanceof ParsingError) {
    res.status(500).json(createResponseBodyError({ message: error.message, type: ParsingErrorType }))
  } else if (error instanceof ValidationError) {
    const { field, message } = getValidationErrorObject(error.message)
    res.status(400).json(createResponseBodyError({ message, type: ValidationErrorType, field }))
  } else {
    res.status(100).json(createResponseBodyError({ message: error.message, type: 'UnknownErrorType' }))
  }
}
