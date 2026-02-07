# Constants

Shared enums used across apps and services.

## MessageStatus

Delivery state for a message.

- `SENDING`: Optimistic UI state while sending.
- `SENT`: Successfully delivered.
- `FAILED`: Delivery error, eligible for retry.

## ParticipantRole

Role of a participant in a thread.

- `VISITOR`: End user / customer.
- `AGENT`: Support agent.
