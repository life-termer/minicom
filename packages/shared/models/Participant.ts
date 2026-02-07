import { ParticipantRole } from '../constants/participantRole'

export type Participant = {
  id: string //supports multiple agents later.
  role: ParticipantRole
  name?: string //optional for anonymous visitors.
}