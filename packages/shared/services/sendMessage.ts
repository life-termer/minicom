import { sendEvent } from './realtime'
import { Message } from '@minicom/shared'

//Optimistic Message Sending. Immediate UI feedback. Mirrors real-world chat apps. Centralized logic for consistency across apps. Simplifies retry logic and error handling.
// UI doesn’t talk to transport directly. Enables retry by calling same function.
export function sendMessageOptimistic(message: Message) {
  sendEvent({
    type: 'MESSAGE_SEND',
    payload: message
  })
}
