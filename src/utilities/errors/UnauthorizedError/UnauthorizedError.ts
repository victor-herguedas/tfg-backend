export class UnautorizedError extends Error {
  type = 'UnauthorizedError'
}

export const getUnauthorizedErrorMessage = (subType: UnauthorizedErrorSubType): string => {
  return subType
}

export type UnauthorizedErrorSubType = 'Unauthorized' | 'InvalidToken' | 'ExpiredToken' | 'InvalidTokenPayload'
