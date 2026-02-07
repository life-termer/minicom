// Threads are inbox-first entities. They represent a conversation between participants and contain messages.
import { Participant } from './Participant'

export type Thread = {
  id: string
  participants: Participant[]
  lastMessageAt: number
  unreadCountByAgent: number //enables fast sorting.
}
