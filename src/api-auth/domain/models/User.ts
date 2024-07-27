import { ParsingError, getParsingErrorMessage } from '../../../utilities/errors/ParsingError/ParsingError.js'
import { generateAuthToken } from '../services/securityService/securityService.js'
import { AuthTokenPayload } from './AuthTokenPayload/AuthTokenPayload.js'

export interface Rol {
  name: string
}

export class User {
  constructor (
    public readonly id: string,
    public readonly email: string,
    public salt: string,
    public password: string,
    public name: string,
    public roles: Rol[],
    public lastConnection: Date | null = null
  ) {}

  getAuthToken = (): string => {
    if (this.id === null) {
      throw new Error('User id is null')
    }
    const authTokenPayload = new AuthTokenPayload(this.id, this.email)
    const authToken = generateAuthToken(authTokenPayload)
    return authToken
  }

  static getUserFromAnyObject = (object: any): User => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = new User(object.id, object.email, object.salt, object.password, object.name, object.rols)
      return user
    } catch (error) {
      throw new ParsingError(getParsingErrorMessage('User'))
    }
  }
}
