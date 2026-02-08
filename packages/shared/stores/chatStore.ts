// Import shared domain types for chat data and typing state
import { Message, Thread, TypingState } from '@minicom/shared'
import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  acknowledgeMessage: (messageId: string) => void // mark a message as DELIVERED
  updateMessageStatus: (messageId: string, status: MessageStatus) => void // update status for retry flow
  applyReadReceipt: (threadId: string, readerId: string) => void // mark messages as READ for sender
  failMessage: (messageId: string) => void // mark a message as FAILED
  setTyping: (typing: TypingState) => void // set typing state for a participant
  markThreadRead: (threadId: string) => void // reset unread count for agent
  markThreadReadByVisitor: (threadId: string) => void // reset unread count for visitor
  clearAll: () => void // clear all threads/messages/typing (testing)
}

const STORAGE_KEY = "minicom-chat-store";

function sortMessagesMap(messages: ChatState["messages"]) {
  const sorted: ChatState["messages"] = {};
  for (const threadId in messages) {
    sorted[threadId] = sortMessagesByTime(messages[threadId]);
  }
  return sorted;
}

// Create Zustand store with state + actions
export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set) => ({
  // Initial state
  threads: {},
  messages: {},
  typing: {},

  // Add or update a thread by id. If thread already exists, it will be replaced. This allows for thread metadata updates (like lastMessageAt) without needing a separate update action. Simplifies thread management by consolidating add/update logic.
  initThread: (thread) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [thread.id]: {
          ...thread,
          unreadCountByAgent: thread.unreadCountByAgent ?? 0,
          unreadCountByVisitor: thread.unreadCountByVisitor ?? 0
        }
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
        // Update thread last message time and unread counts. Counts only increment for DELIVERED messages from the other participant, ensuring accurate unread tracking. Centralized thread updates promote consistency across the app and simplify debugging. Mirrors backend message protocols for seamless integration.
        threads: {
          ...state.threads,
          [message.threadId]: {
            ...state.threads[message.threadId],
            lastMessageAt: message.createdAt,
            unreadCountByAgent:
              message.status === MessageStatus.DELIVERED &&
              message.senderId !== 'agent'
                ? state.threads[message.threadId].unreadCountByAgent + 1
                : state.threads[message.threadId].unreadCountByAgent,
            unreadCountByVisitor:
              message.status === MessageStatus.DELIVERED &&
              message.senderId === 'agent'
                ? state.threads[message.threadId].unreadCountByVisitor + 1
                : state.threads[message.threadId].unreadCountByVisitor
          }
        }
      }
    }),

  // Traverse all threads and mark the target message as DELIVERED without downgrading READ. This allows for out-of-order ACKs, where the acknowledgment might arrive after subsequent messages. Centralized acknowledgment logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  acknowledgeMessage: (messageId) =>
    set((state) => {
      const updatedMessages: ChatState['messages'] = {}

      for (const threadId in state.messages) {
        updatedMessages[threadId] = state.messages[threadId].map((m) =>
          m.id === messageId
            ? m.status === MessageStatus.READ
              ? m
              : { ...m, status: MessageStatus.DELIVERED }
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

  // Update message status across all threads. Used for retry flow without duplicating messages.
  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const updatedMessages: ChatState['messages'] = {}

      for (const threadId in state.messages) {
        updatedMessages[threadId] = state.messages[threadId].map((m) =>
          m.id === messageId
            ? { ...m, status }
            : m
        )
      }

      return { messages: updatedMessages }
    }),

  // Apply read receipt for a thread by updating message statuses for the sender.
  applyReadReceipt: (threadId, readerId) =>
    set((state) => {
      const threadMessages = state.messages[threadId] || []
      const updatedMessages = threadMessages.map((message) =>
        message.senderId !== readerId &&
        (message.status === MessageStatus.DELIVERED ||
          message.status === MessageStatus.SENT)
          ? { ...message, status: MessageStatus.READ, readAt: Date.now() }
          : message
      )

      return {
        messages: {
          ...state.messages,
          [threadId]: updatedMessages
        }
      }
    }),

  // Store typing state by a composite key threadId:participantId. This allows us to track typing indicators for multiple participants across multiple threads without collisions. Centralized typing logic promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
  setTyping: (typing) =>
    set((state) => ({
      typing: {
        ...state.typing,
        [`${typing.threadId}:${typing.participantId}`]: typing
      }
    })),

  // Mark a thread as read by zeroing unread count for agent and updating message statuses.
  markThreadRead: (threadId) =>
    set((state) => {
      const threadMessages = state.messages[threadId] || []
      const updatedMessages = threadMessages.map((message) =>
        message.senderId != 'agent' &&
        (message.status === MessageStatus.DELIVERED ||
          message.status === MessageStatus.SENT)
          ? { ...message, status: MessageStatus.READ, readAt: Date.now() }
          : message
      )

      return {
        threads: {
          ...state.threads,
          [threadId]: {
            ...state.threads[threadId],
            unreadCountByAgent: 0
          }
        },
        messages: {
          ...state.messages,
          [threadId]: updatedMessages
        }
      }
    }),

  // Mark a thread as read by zeroing unread count for visitor and updating message statuses.
  markThreadReadByVisitor: (threadId) =>
    set((state) => {
      const threadMessages = state.messages[threadId] || []
      const updatedMessages = threadMessages.map((message) =>
        message.senderId != 'visitor' &&
        (message.status === MessageStatus.DELIVERED ||
          message.status === MessageStatus.SENT)
          ? { ...message, status: MessageStatus.READ, readAt: Date.now() }
          : message
      )

      return {
        threads: {
          ...state.threads,
          [threadId]: {
            ...state.threads[threadId],
            unreadCountByVisitor: 0
          }
        },
        messages: {
          ...state.messages,
          [threadId]: updatedMessages
        }
      }
    }),
    

  clearAll: () =>
    set(() => ({
      threads: {},
      messages: {},
      typing: {}
    }))
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        threads: state.threads,
        messages: state.messages,
        typing: state.typing
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.messages = sortMessagesMap(state.messages);
      }
    }
  )
)

