import { useMemo, useEffect } from 'react'
import { Message, MessageList, ChatInput, Button, TypingIndicator } from '@minicom/shared/ui'
import { useChatStore } from '@minicom/shared'
import { generateId } from '@minicom/shared'
import { MessageStatus } from '@minicom/shared'
import { sendMessageOptimistic } from '@minicom/shared'
import { sendReadReceipt } from '@minicom/shared'

export function ThreadView({ threadId }: { threadId?: string }) {
  const messageMap = useChatStore((s) => s.messages)
  const emptyMessages = useMemo<Message[]>(() => [], [])
  const messages = useMemo(() => {
    if (!threadId) return emptyMessages
    return messageMap[threadId] || emptyMessages
  }, [threadId, messageMap, emptyMessages])

  const clearAll = useChatStore((s) => s.clearAll)
  const markRead = useChatStore((s) => s.markThreadRead)
  const unreadCountByAgent = useChatStore(
    (s) => (threadId ? s.threads[threadId]?.unreadCountByAgent ?? 0 : 0)
  )

  useEffect(() => {
    if (!threadId) return
    if (unreadCountByAgent === 0) return
    markRead(threadId)
    sendReadReceipt(threadId, 'agent')
  }, [threadId, unreadCountByAgent, markRead])

  const isTyping = useChatStore((s) => {
    if (!threadId) return false
    for (const key in s.typing) {
      const typing = s.typing[key]
      if (
        typing.threadId === threadId &&
        typing.isTyping &&
        typing.participantId !== "agent"
      ) {
        return true
      }
    }
    return false
  })
  

  if (!threadId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <span>Select a conversation</span>
      </div>
    )
  }

  return (
    <div className="flex relative h-[calc(100%-60px)] flex-col">
      <div className="flex items-center justify-end border-b border-[var(--mc-border)] px-4 py-2">
        <Button size="sm" variant="outline" onClick={clearAll}>
          Clear all threads
        </Button>
      </div>

      <div className="overflow-y-auto py-6 px-10">
        <MessageList
          messages={messages} 
          currentUserId="agent"
        />
      </div>

     {isTyping && (
               <div className='absolute bottom-16 left-6 z-50 w-[calc(100%-3rem)] sm:w-[320px] px-5 py-2'>
                 <TypingIndicator label="Agent is typing..." />
               </div>
             )}

      <ChatInput threadId={threadId} authorId="agent" placeholder="Reply…" />
    </div>
  )
}
