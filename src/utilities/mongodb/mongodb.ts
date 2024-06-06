import mongoose from 'mongoose'
import chalk from 'chalk'
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
    console.log(`${chalk.blue('Conecting to MongoDB...')}`)
    const connection = mongoose.createConnection(uri, { dbName: MONGO_DB_NAME })

    return await new Promise((resolve, reject) => {
      connection.once('open', () => {
        console.log(`${chalk.green('Database connected')}`)
        resolve(connection)
      })

      connection.once('error', (err) => {
        console.error(`${chalk.red('Connection to database error: ', err)}`)
        reject(err)
      })
    })
  } catch (error) {
    console.error(error)
  }
  throw new Error('Error connecting to mongodb')
}
const mongodbConnection = await getConnection()
export { mongodbConnection }

export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id)
}
