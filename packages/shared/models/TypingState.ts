// Explicit timestamps allow debouncing. Prevents stale typing indicators.
export type TypingState = {
  threadId: string
  participantId: string
  isTyping: boolean
  updatedAt: number
}
