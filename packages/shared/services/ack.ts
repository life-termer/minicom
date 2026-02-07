//Message Acknowledgment Logic. Explicit acknowledgment channel. Allows retry logic. Mirrors real-world message delivery semantics. Centralized logic for maintainability and consistency across apps. Makes delivery observable.
import { sendEvent } from './realtime'

export function acknowledgeMessage(messageId: string) {
  sendEvent({
    type: 'MESSAGE_ACK',
    payload: { messageId }
  })
}
