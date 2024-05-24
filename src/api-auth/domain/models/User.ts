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
    public rols: Rol[]
  ) {}

  getAuthToken = (): string => {
    if (this.id === null) {
      throw new Error('User id is null')
    }
    console.log(this.id)
    const authTokenPayload = new AuthTokenPayload(this.id, this.email)
    const authToken = generateAuthToken(authTokenPayload)
    return authToken
  }

  static getUserFromAnyObject = (object: any): User => {
    console.log('getUserFromAnyObject')
    try {
      console.log(object)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = new User(object._id, object.email, object.salt, object.password, object.name, object.rols)
      console.log('pepe')
      return user
    } catch (error) {
      console.log('error')
      throw new ParsingError(getParsingErrorMessage('User'))
    }
  }
}
