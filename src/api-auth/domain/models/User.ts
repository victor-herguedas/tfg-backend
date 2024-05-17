import { generateAuthToken } from '../services/securityService/securityService.js'
import { AuthTokenPayload } from './AuthTokenPayload/AuthTokenPayload.js'

export interface Rol {
  name: string
}

export class User {
  constructor (
    public readonly id: string | null,
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
    const authTokenPayload = new AuthTokenPayload('1', this.email)
    const authToken = generateAuthToken(authTokenPayload)
    return authToken
  }
}
