import { type Response, type Request, type NextFunction } from 'express'
import { NotSupportedFileTypeError, NotSupportedFileTypeErrorType } from '../../utilities/errors/NotSupportedFileTypeError/NotSupportedFileTypeError.js'
import { createResponseBodyError } from '../../utilities/errors/createResponseError.js'
import { NotSupportedFileSizeError, NotSupportedFileSizeErrorType } from '../../utilities/errors/NotSupportedFileSizeError/NotSupportedFileSizerError.js'
import { OpenAiApiError, OpenAiApiErrorType } from '../../utilities/errors/OpenAiApiError/OpenAiApiError.js'
import { MissingFileError, MissingFileErrorType } from '../../utilities/errors/MissingFileError/MissingFileError.js'
import { ParsingError, ParsingErrorType } from '../../utilities/errors/ParsingError/ParsingError.js'
import { ValidationError, ValidationErrorType, getValidationErrorObject } from '../../utilities/errors/ValidationError/ValidationError.js'
import { UnautorizedError } from '../../utilities/errors/UnauthorizedError/UnauthorizedError.js'
import { DatabaseError } from '../../utilities/errors/DatabaseError/DatabaseError.js'
import { EmailAlreadyExistError } from '../../utilities/errors/EmailAlreadyExistError/EmailAlreadyExistError.js'
import { InternalError } from '../../utilities/errors/InternalError/InternalError.js'
import { NotFoundError } from '../../utilities/errors/NotFoundError/NotFoundError.js'
import { ActionAlreadyRunningError } from '../../utilities/errors/ActionAlreadyRuningError/EmailAlreadyExistError.js'
import { ResourceAlreadyExistError } from '../../utilities/errors/ResourceAlreadyExistError/ResourceAlreadyExistError.js'

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
  } else if (error instanceof UnautorizedError) {
    res.status(401).json(createResponseBodyError({ message: error.message, type: error.type }))
  } else if (error instanceof DatabaseError) {
    res.status(500).json(createResponseBodyError({ message: error.message, type: error.type }))
  } else if (error instanceof EmailAlreadyExistError) {
    res.status(400).json(createResponseBodyError({ message: error.message, type: error.name }))
  } else if (error instanceof InternalError) {
    res.status(500).json(createResponseBodyError({ message: error.message, type: error.name }))
  } else if (error instanceof NotFoundError) {
    res.status(404).json(createResponseBodyError({ message: error.message, type: error.type }))
  } else if (error instanceof ActionAlreadyRunningError) {
    res.status(409).json(createResponseBodyError({ message: error.message, type: error.name }))
  } else if (error instanceof ResourceAlreadyExistError) {
    res.status(409).json(createResponseBodyError({ message: error.message, type: error.name }))
  } else {
    res.status(500).json(createResponseBodyError({ type: 'UnknownErrorType' }))
  }
}
