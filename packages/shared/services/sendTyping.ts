
import { sendEvent } from './realtime'

export type TypingPayload = {
  threadId: string;
  participantId: string;
  isTyping: boolean;
  updatedAt: number;
};

export function sendTyping(payload: TypingPayload) {
  sendEvent({
    type: "TYPING",
    payload,
  });
}
