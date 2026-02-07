# Utils

Shared helper functions used across apps and services.

## generateId

Creates a unique id using the runtime `crypto.randomUUID()` API.

## sortMessagesByTime

Returns a new array of messages sorted by `createdAt` ascending.

- Handles out-of-order delivery.
- Keeps display order and read receipts consistent.
