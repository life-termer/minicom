import { CHAT_CHANNEL } from './channel'
import { ChatEvent } from './events'

// BroadcastChannel provides same-origin, tab-to-tab message passing.
// We keep a single (Singleton) shared channel instance to avoid duplicate listeners.
let channel: BroadcastChannel | null = null

// Lazily create and return the shared BroadcastChannel instance.
export function getRealtimeChannel() {
  if (!channel) {
    channel = new BroadcastChannel(CHAT_CHANNEL)
  }
  return channel
}

// Publish a chat event to all subscribers on this origin. The event is strongly typed as ChatEvent, ensuring that all published events conform to the defined structure. Centralized sending logic promotes consistency and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
export function sendEvent(event: ChatEvent) {
  getRealtimeChannel().postMessage(event)
}

// Subscribe to chat events; returns an unsubscribe cleanup function → React-friendly. The handler receives strongly-typed ChatEvent objects, ensuring type safety and clear event handling across the app. Centralized subscription logic simplifies management and promotes consistency. Mirrors backend message protocols for seamless integration.
export function subscribe(
  handler: (event: ChatEvent) => void
) {
  const ch = getRealtimeChannel()

  // The BroadcastChannel message event carries the payload in e.data. We type it as ChatEvent to ensure that handlers receive the correct event structure, improving type safety and developer experience. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration.
  const listener = (e: MessageEvent<ChatEvent>) => {
    handler(e.data)
  }

  ch.addEventListener('message', listener)

  return () => {
    ch.removeEventListener('message', listener)
  }
}


// The Flow (Conceptual)
// User sends message
// Message added locally with status: sending
// Event broadcasted
// Receiver responds with ACK
// Sender updates status → sent
// Failure → failed
// This mirrors real websocket delivery semantics.