export interface Rol {
  name: string
}

export class User {
  constructor (
    public readonly id: string | null,
    public readonly email: string,
    public readonly salt: string,
    public readonly password: string,
    public readonly name: string,
    public readonly roles: Rol[]
  ) {}
}
