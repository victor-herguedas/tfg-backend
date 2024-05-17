import { type UserEntityInterface } from '../enitties/UserEntity.js'

export const saveUserEntity = async (userEnity: UserEntityInterface): Promise<UserEntityInterface> => {
  return await userEnity.save()
}
