import { sendEvent } from "./realtime";

export type PresenceStatus = "online" | "offline";

export function sendPresence(participantId: string, status: PresenceStatus) {
  sendEvent({
    type: "PRESENCE",
    payload: { participantId, status }
  });
}
