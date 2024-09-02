import { type Request, type Response, type NextFunction } from 'express'
import { createNewUserHandler } from '../../../domain/handlers/createUserHandler/createUserHandler.js'
import { getRegisterUserDto } from '../dtos/registerUserDto/registerUserDto.js'
import { logInUserHandler } from '../../../domain/handlers/loginUserHandler/loginUserHandler.js'
import { getLoginUserDto } from '../dtos/loginUserDto/loginUserDto.js'

export const registerPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const RegisterUserDto = await getRegisterUserDto(req)
    const user = await createNewUserHandler(RegisterUserDto)

    const token = user.getAuthToken()
    res.cookie('JWT', token, { httpOnly: true, secure: false })

    res.status(201).json({ message: 'User created' })
  } catch (error) {
    next(error)
  }
}

export const loginPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const LoginUserDto = await getLoginUserDto(req)
    const user = await logInUserHandler(LoginUserDto)

    const token = user.getAuthToken()
    res.cookie('JWT', token, { httpOnly: true, secure: false })

    res.status(200).json({ message: 'loggin successfully' })
  } catch (error) {
    next(error)
  }
}
