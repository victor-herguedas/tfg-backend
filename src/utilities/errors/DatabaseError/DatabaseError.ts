export class DatabaseError extends Error {
  type = 'InternalError'
  constructor (message = 'Database error') {
    super(message)
    this.name = 'DatabaseError'
  }
}
