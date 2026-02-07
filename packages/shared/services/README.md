# Services

Shared service helpers used across apps.

## ack

Acknowledges message delivery by broadcasting a `MESSAGE_ACK` event.

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

## realtime

BroadcastChannel-based pub/sub for same-origin tabs:

- `getRealtimeChannel`: lazy singleton channel creation.
- `sendEvent`: publish a `ChatEvent` to all listeners.
- `subscribe`: listen for events and return an unsubscribe function.
