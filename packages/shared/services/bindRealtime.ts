import { subscribe } from './realtime'
import { useChatStore } from '../stores/chatStore'
import { acknowledgeMessage } from './ack'
import { MessageStatus } from '../constants/messageStatus'

export type BindRealtimeOptions = {
  currentUserId?: string
}

function playNotificationSound() {
  if (typeof window === 'undefined') return
  const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext
  if (!AudioContext) return

  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.08

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 0.12)

  oscillator.onended = () => {
    context.close()
  }
}

// Binds real-time events to chat store updates. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app. React-friendly subscription with cleanup ensures efficient resource management and prevents memory leaks.
export function bindRealtime(options: BindRealtimeOptions = {}) {
  const { currentUserId } = options
  return subscribe((event) => {
    // Get current store state and actions. We access the store state inside the event handler to ensure we have the latest state when processing events. This allows us to update the store in response to real-time events across all tabs. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
    const store = useChatStore.getState()
    // Handle each event type and update the store accordingly. This ensures that the UI stays in sync with real-time events across all tabs. Centralized event handling promotes consistency across the app and simplifies debugging. Mirrors backend message protocols for seamless integration across the app.
    switch (event.type) {
      case 'THREAD_INIT':
        store.initThread(event.payload)
        break

      case 'MESSAGE_SEND': {
        const isReceiver = currentUserId && event.payload.senderId !== currentUserId
        const incomingMessage = isReceiver
          ? { ...event.payload, status: MessageStatus.DELIVERED }
          : event.payload
        store.addMessage(incomingMessage)
        if (isReceiver) {
          acknowledgeMessage(event.payload.id)
          playNotificationSound()
        }
        break
      }

      case 'MESSAGE_ACK':
        store.acknowledgeMessage(event.payload.messageId)
        break

      case 'MESSAGE_READ':
        store.applyReadReceipt(event.payload.threadId, event.payload.readerId)
        break

      case 'TYPING':
        store.setTyping(event.payload)
        break
    }
  })
}
