import { type FormFile } from '../../utilities/serializations/audioSerialization.js'
import { CreateMeetingDto } from '../adapters/primary/dtos/createMeetingDto.js'
import { getFormFileMother } from './FormFileMother.js'

interface Params {
  name?: string
  date?: Date
  audio?: FormFile
}

export const getCreateMeetingDtoMother = ({
  name = 'Reunion de bienvendia',
  date = new Date('2002-06-22'),
  audio = getFormFileMother({})
}: Params): CreateMeetingDto => (new CreateMeetingDto(
  name,
  date,
  audio
))
