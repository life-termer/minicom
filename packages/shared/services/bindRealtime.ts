import { subscribe } from './realtime'
import { useChatStore } from '../stores/chatStore'
import { acknowledgeMessage } from './ack'
// Binds real-time events to chat store updates. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app. React-friendly subscription with cleanup ensures efficient resource management and prevents memory leaks.
export function bindRealtime() {
  return subscribe((event) => {
    // Get current store state and actions. We access the store state inside the event handler to ensure we have the latest state when processing events. This allows us to update the store in response to real-time events across all tabs. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
    const store = useChatStore.getState()
    // Handle each event type and update the store accordingly. This ensures that the UI stays in sync with real-time events across all tabs. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
    switch (event.type) {
      case 'THREAD_INIT':
        store.initThread(event.payload)
        break

      case 'MESSAGE_SEND':
        store.addMessage(event.payload)
        acknowledgeMessage(event.payload.id)
        break

      case 'MESSAGE_ACK':
        store.acknowledgeMessage(event.payload.messageId)
        break

      case 'TYPING':
        store.setTyping(event.payload)
        break
    }
  })
}
