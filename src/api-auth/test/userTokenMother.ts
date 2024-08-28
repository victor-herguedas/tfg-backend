import { generateAuthToken } from '../domain/services/securityService/securityService.js'

export const getUserTokenMother = (): string => {
  const token = generateAuthToken({ id: '664bbc255926673e7122649e', email: 'exist@test.es' })
  return token
}
export const getUSer2TokenMother = (): string => {
  const token = generateAuthToken({
    id: '6651a929c99b6216df26fca0',
    email: 'notMeetings@test.com'
  })
  return token
}

export const getNotExistingUserTokenMother = (): string => {
  const token = generateAuthToken({ id: '664bbc255926673e7122649f', email: 'notExist@test.com' })
  return token
}
