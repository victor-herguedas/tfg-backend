import { type Request, type Response, type NextFunction } from 'express'
import { getRegisterUserDto } from '../dtos/registerUserDto.js'
import { createNewUser } from '../../../domain/services/createUserService/createUserService.js'

export const registerPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const RegisterUserDto = await getRegisterUserDto(req)
    const user = await createNewUser(RegisterUserDto)
    const token = user.getAuthToken()
    res.cookie('token', token, { httpOnly: true, secure: true })
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    next(error)
  }
}
