//Explicit event types: Clear structure for event handling. Each event has a specific type and payload, making it easy to manage and extend. Centralized definition promotes consistency across the app and simplifies debugging. Mirrors backend message protocols.
import { Message, TypingState, Thread } from '@minicom/shared'

export type ChatEvent =
  | { type: 'MESSAGE_SEND'; payload: Message }
  | { type: 'MESSAGE_ACK'; payload: { messageId: string } }
  | { type: 'TYPING'; payload: TypingState }
  | { type: 'THREAD_INIT'; payload: Thread }
