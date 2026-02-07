// Import shared domain types for chat data and typing state
import { Message, Thread, TypingState } from '@minicom/shared'
import { create } from "zustand";
import { sortMessagesByTime } from '../utils/sortMessages'
import { MessageStatus } from '../constants/messageStatus'

// Shape of the store state: threads, messages per thread, and typing indicators. Organized for efficient access and updates. Mirrors the core data structures of the chat domain, making it intuitive for developers to work with.
export type ChatState = {
  threads: Record<string, Thread> // map of threadId -> Thread metadata
  messages: Record<string, Message[]> // map of threadId -> list of messages
  typing: Record<string, TypingState> // map of "threadId:participantId" -> typing state
}

// Actions that mutate the store. Each action corresponds to a specific state change, like adding a message or updating typing status. This clear separation of concerns makes the store easier to maintain and reason about.
export type ChatActions = {
  initThread: (thread: Thread) => void // add or replace a thread in state
  addMessage: (message: Message) => void // add a message and update thread metadata
  acknowledgeMessage: (messageId: string) => void // mark a message as SENT
  failMessage: (messageId: string) => void // mark a message as FAILED
  setTyping: (typing: TypingState) => void // set typing state for a participant
  markThreadRead: (threadId: string) => void // reset unread count for agent
}

// Create Zustand store with state + actions
export const useChatStore = create<ChatState & ChatActions>()((set) => ({
  // Initial state
  threads: {},
  messages: {},
  typing: {},

  // Add or update a thread by id. If thread already exists, it will be replaced. This allows for thread metadata updates (like lastMessageAt) without needing a separate update action. Simplifies thread management by consolidating add/update logic.
  initThread: (thread) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.id]: thread
      }
    })),

  // Add message to its thread, keep messages sorted, update thread metadata. This ensures that the UI can render messages in the correct order and that thread metadata (like lastMessageAt and unread counts) stays accurate. Centralized message handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration.
  addMessage: (message) =>
    set((state) => {
      const threadMessages = state.messages[message.threadId] || []

      return {
        // Append message and sort by time
        messages: {
          ...state.messages,
          [message.threadId]: sortMessagesByTime([
            ...threadMessages,
            message
          ])
        },
        // Update thread last message time and unread count for agent. Unread count only increments if message is SENT and not from agent, ensuring accurate unread tracking. Centralized thread updates promote consistency across the app and simplify debugging. Mirrors backend message protocols for seamless integration.
        threads: {
          ...state.threads,
          [message.threadId]: {
            ...state.threads[message.threadId],
            lastMessageAt: message.createdAt,
            unreadCountByAgent:
              message.status === MessageStatus.SENT &&
              message.senderId !== 'agent'
                ? state.threads[message.threadId].unreadCountByAgent + 1
                : state.threads[message.threadId].unreadCountByAgent
          }
        }
      }
    }),

  // Traverse all threads and mark the target message as SENT. This allows for out-of-order ACKs, where the acknowledgment might arrive after subsequent messages. Centralized acknowledgment logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  acknowledgeMessage: (messageId) =>
    set((state) => {
      const updatedMessages: ChatState['messages'] = {}

      for (const threadId in state.messages) {
        updatedMessages[threadId] = state.messages[threadId].map((m) =>
          m.id === messageId
            ? { ...m, status: MessageStatus.SENT }
            : m
        )
      }

      return { messages: updatedMessages }
    }),

  // Traverse all threads and mark the target message as FAILED. This allows for out-of-order failure notifications, where the failure might be detected after subsequent messages. Centralized failure logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  failMessage: (messageId) =>
    set((state) => {
      const updatedMessages: ChatState['messages'] = {}

      for (const threadId in state.messages) {
        updatedMessages[threadId] = state.messages[threadId].map((m) =>
          m.id === messageId
            ? { ...m, status: MessageStatus.FAILED }
            : m
        )
      }

      return { messages: updatedMessages }
    }),

  // Store typing state by a composite key threadId:participantId. This allows us to track typing indicators for multiple participants across multiple threads without collisions. Centralized typing logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  setTyping: (typing) =>
    set((state) => ({
      typing: {
        ...state.typing,
        [`${typing.threadId}:${typing.participantId}`]: typing
      }
    })),

  // Mark a thread as read by zeroing unread count for agent. This allows the UI to reflect that the agent has seen all messages in the thread. Centralized read logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  markThreadRead: (threadId) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: {
          ...state.threads[threadId],
          unreadCountByAgent: 0
        }
      }
    }))
}))

