import { sendEvent } from './realtime'

export function sendReadReceipt(threadId: string, readerId: string) {
  sendEvent({
    type: 'MESSAGE_READ',
    payload: { threadId, readerId }
  })
}
