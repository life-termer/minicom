# Models

Shared data shapes used across apps and services.

## Message

Represents a single chat message.

- `id`: Unique message id.
- `threadId`: Conversation the message belongs to.
- `senderId`: Participant id for the sender.
- `body`: Message text content.
- `createdAt`: Unix timestamp (ms) for ordering and out-of-order correction.
- `status`: `MessageStatus` for optimistic UI and retries.
- `readAt`: Optional Unix timestamp (ms) for read receipts.

## Participant

Represents a person or agent in a thread.

- `id`: Unique participant id (supports multiple agents later).
- `role`: `ParticipantRole` for agent vs visitor.
- `name`: Optional display name for anonymous visitors.

## Thread

Inbox-first conversation entity containing participants and derived state.

- `id`: Unique thread id.
- `participants`: List of `Participant` entities.
- `lastMessageAt`: Unix timestamp (ms) of last message.
- `unreadCountByAgent`: Unread count for agent view (supports fast sorting).

## TypingState

Tracks live typing status per participant.

- `threadId`: Conversation id.
- `participantId`: Who is typing.
- `isTyping`: Current typing flag.
- `updatedAt`: Unix timestamp (ms) for debounce and stale-state prevention.
