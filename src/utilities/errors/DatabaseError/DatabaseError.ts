export class DatabaseError extends Error {
  type = 'InternalError'
  constructor (message: string = 'Database error') {
    super(message)
    this.name = 'DatabaseError'
  }
}
