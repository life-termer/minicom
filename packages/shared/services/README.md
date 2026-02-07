# Services

Shared service helpers used across apps.

## ack

Acknowledges message delivery by broadcasting a `MESSAGE_ACK` event.

## bindRealtime

Subscribes to realtime events and wires them into the chat store, returning an unsubscribe function.

## channel

Defines the shared BroadcastChannel name (`minicom-chat`).

## events

Defines the `ChatEvent` union used for realtime messaging:

- `MESSAGE_SEND`: new message payload.
- `MESSAGE_ACK`: delivery acknowledgment payload.
- `TYPING`: typing status payload.
- `THREAD_INIT`: thread bootstrap payload.

## network

`simulateNetwork` runs a function with a small chance to throw, to mimic flaky networks during testing.

## sendMessage

`sendMessageOptimistic` publishes a `MESSAGE_SEND` event so the UI can update immediately.

## realtime

BroadcastChannel-based pub/sub for same-origin tabs:

- `getRealtimeChannel`: lazy singleton channel creation.
- `sendEvent`: publish a `ChatEvent` to all listeners.
- `subscribe`: listen for events and return an unsubscribe function.
