//Required for out-of-order handling. Messages can arrive out of order due to network conditions. Sorting by createdAt ensures correct display order and accurate read receipts, even if messages are received late or in the wrong sequence. Centralized logic avoids duplication.Easy to test.
import { Message } from '../models/Message'

export function sortMessagesByTime(messages: Message[]) {
  return [...messages].sort(
    (a, b) => a.createdAt - b.createdAt
  )
}
