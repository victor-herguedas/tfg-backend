import { type CreateMeetingDto } from '../../adapters/primary/dtos/createMeetingDto.js'
import { type Meeting } from '../models/Meeting.js'

export const createMeeting = async (createMeetingDto: CreateMeetingDto): Promise<Meeting> => {
  // Crear la reunión con los datos del dto
  // llamar a un metodo en otro hilo que
  //    Transcriba la reunión
  //    Almacene la transcripción
  //    Cambie el estadio de la reunión a "Transcrita"
  // Devolver la id de la reunión sin esperar a que termine el hilo anterior
}
