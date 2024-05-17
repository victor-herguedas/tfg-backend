import mongoose from 'mongoose'
import { MONGO_DB_NAME, MONGO_URI } from '../environment.js'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const getConnection = async (): Promise<mongoose.Connection> => {
  try {
    let uri: string
    if (process.env.NODE_ENV === 'test') {
      const mongod = await MongoMemoryServer.create()
      uri = mongod.getUri()
    } else {
      uri = MONGO_URI
    }
    const connection = mongoose.createConnection(uri, { dbName: MONGO_DB_NAME })

    return connection
  } catch (error) {
    console.error(error)
  }
  throw new Error('Error connecting to mongodb')
}
const mongodbConnection = await getConnection()
export { mongodbConnection }
