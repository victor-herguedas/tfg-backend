export interface ResponseBodyError {
  type?: string
  message?: string
  field?: string
}

export const createResponseBodyError = ({ type, message, field }: ResponseBodyError): ResponseBodyError => {
  return {
    type,
    message,
    field
  }
}
