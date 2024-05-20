import { type User } from '../../../api-auth/domain/models/User.js'
import { type CreateMeetingDto } from '../../adapters/primary/dtos/createMeetingDto.js'
import { saveMeeting } from '../../adapters/secondary/daoAdapters/MeetingDaoAdapter.js'
import { type Meeting } from '../models/Meeting.js'

export const createMeetingHandler = async (createMeetingDto: CreateMeetingDto, user: User): Promise<Meeting> => {
  const meeting = await saveMeeting(createMeetingDto.name, createMeetingDto.date, user.id)
  // llamar a un metodo en otro hilo que
  //    Transcriba la reunión
  //    Almacene la transcripción
  //    Cambie el estadio de la reunión a "Transcrita"
  return meeting
}
