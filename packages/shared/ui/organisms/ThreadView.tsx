import { useMemo, useEffect } from 'react'
import { Message, MessageList, ChatInput, Button } from '@minicom/shared/ui'
import { useChatStore } from '@minicom/shared'
import { generateId } from '@minicom/shared'
import { MessageStatus } from '@minicom/shared'
import { sendMessageOptimistic } from '@minicom/shared'

export function ThreadView({ threadId }: { threadId?: string }) {
  const messageMap = useChatStore((s) => s.messages)
  const emptyMessages = useMemo<Message[]>(() => [], [])
  const messages = useMemo(() => {
    if (!threadId) return emptyMessages
    return messageMap[threadId] || emptyMessages
  }, [threadId, messageMap, emptyMessages])

  const clearAll = useChatStore((s) => s.clearAll)
  const markRead = useChatStore((s) => s.markThreadRead)

  if (!threadId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <span>Select a conversation</span>
        <Button size="sm" variant="outline" onClick={clearAll}>
          Clear all threads
        </Button>
      </div>
    )
  }

  const send = (text: string) => {
    const message = {
      id: generateId(),
      threadId,
      senderId: 'agent',
      body: text,
      createdAt: Date.now(),
      status: MessageStatus.SENDING
    }

    useChatStore.getState().addMessage(message)
    sendMessageOptimistic(message)
  }

  useEffect(() => {
    markRead(threadId)
  }, [threadId, markRead])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b border-[var(--mc-border)] px-4 py-2">
        <Button size="sm" variant="outline" onClick={clearAll}>
          Clear all threads
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-10">
        <MessageList
          messages={messages} 
          currentUserId="agent"
        />
      </div>

      <ChatInput threadId={threadId} authorId="agent" placeholder="Reply…" />
    </div>
  )
}
