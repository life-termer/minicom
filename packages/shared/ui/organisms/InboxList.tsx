import { useMemo } from 'react'
import { useChatStore } from '@minicom/shared'
import { InboxListItem } from '../molecules/InboxListItem'

export function InboxList({
  activeThreadId,
  onSelect
}: {
  activeThreadId?: string
  onSelect: (id: string) => void
}) {
  const threadMap = useChatStore((s) => s.threads)
  const markRead = useChatStore((s) => s.markThreadRead)
  const threads = useMemo(() => {
    return Object.values(threadMap).sort((a, b) => {
      if (a.unreadCountByAgent !== b.unreadCountByAgent) {
        return b.unreadCountByAgent - a.unreadCountByAgent
      }
      return b.lastMessageAt - a.lastMessageAt
    })
  }, [threadMap])

  const handleSelect = (threadId: string) => {
    if (threadId !== activeThreadId) {
      markRead(threadId)
    }
    onSelect(threadId)
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto">
      {threads.map((thread) => (
        <InboxListItem
          key={thread.id}
          thread={thread}
          active={thread.id === activeThreadId}
          onClick={() => handleSelect(thread.id)}
        />
      ))}
    </div>
  )
}
