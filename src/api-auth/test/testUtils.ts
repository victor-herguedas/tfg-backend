import { mongodbConnection } from '../../utilities/mongodb/mongodb.js'
import { UserEntity } from '../adapters/secundary/enitties/UserEntity.js'

export const restartDatabase = async (): Promise<void> => {
  const collections = await mongodbConnection.db?.listCollections()?.toArray()
  if (collections !== undefined) {
    for (const collection of collections) {
      await mongodbConnection.db.collection(collection.name).deleteMany({})
    }
  }
  await addUsers()
}

const addUsers = async (): Promise<void> => {
  await new UserEntity({
    email: 'exist@test.com',
    salt: 'salt',
    password: 'password',
    name: 'exist',
    rols: []
  }).save()
}
