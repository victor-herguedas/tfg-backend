import { mongodbConnection } from '../mongodb/mongodb.js'
import { UserEntity } from '../../api-auth/adapters/secundary/enitties/UserEntity.js'
import { generateSalt, hashPassword } from '../../api-auth/domain/services/securityService/securityService.js'

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
  const userSalt = generateSalt()
  const userPassword = '12345678'
  await new UserEntity({
    email: 'exist@test.com',
    salt: userSalt,
    password: hashPassword(userPassword, userSalt),
    name: 'exist',
    rols: []
  }).save()
}
