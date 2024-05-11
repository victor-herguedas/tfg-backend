import { type Request, type Response, type NextFunction } from 'express'
import { getRegisterUserDto } from '../dtos/registerUserDto.js'

export const registerPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const RegisterUserDto = await getRegisterUserDto(req)
    res.status(201).json({ message: 'User created' })
  } catch (error) {
    next(error)
  }
}

// Comprobar si el usuario ya existe
// Crear el hash y el salt de la contraseña
// Guardar los datos en la base de datos
// Mandar un token
