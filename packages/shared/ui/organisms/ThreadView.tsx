import { useMemo } from 'react'
import { Message, MessageList, ChatInput } from '@minicom/shared/ui'
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

  const markRead = useChatStore((s) => s.markThreadRead)

  if (!threadId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation
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

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages} 
          currentUserId="agent"
          //onVisible={() => markRead(threadId)}
        />
      </div>

      <ChatInput threadId={threadId} authorId="agent" placeholder="Reply…" />
    </>
  )
}
