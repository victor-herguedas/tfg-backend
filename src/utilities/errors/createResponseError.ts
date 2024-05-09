export interface ResponseBodyError {
  type: string | null
  message: string | null
  field: string | null
}

export const createResponseBodyError = ({ type, message, field }: { type?: string, message?: string, field?: string }): ResponseBodyError => {
  return {
    type: type ?? null,
    message: message ?? null,
    field: field ?? null
  }
}
