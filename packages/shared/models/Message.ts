import { MessageStatus } from '../constants/messageStatus'

export type Message = {
  id: string
  threadId: string
  senderId: string
  body: string
  createdAt: number // enables Sorting/Out-of-order correction
  status: MessageStatus //enables optimistic UI and retries.
  readAt?: number //supports read receipts without complexity.
}
