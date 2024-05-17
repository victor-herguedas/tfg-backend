import { type Request, type Response, type NextFunction } from 'express'
import { createNewUser } from '../../../domain/handlers/createUserHandler/createUserHandler.js'
import { getRegisterUserDto } from '../dtos/registerUserDto/registerUserDto.js'
import { getLoginUserDto } from '../dtos/loginUserDto/loginUserDto.js'
import { logInUser } from '../../../domain/handlers/loginUserHandler/loginUserHandler.js'

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

export const loginPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const LoginUserDto = await getLoginUserDto(req)
    const user = await logInUser(LoginUserDto)

    const token = user.getAuthToken()
    res.cookie('token', token, { httpOnly: true, secure: true })

    res.status(200).json({ message: 'loggin successfully' })
  } catch (error) {
    next(error)
  }
}

// llamar a si existe el usuario
