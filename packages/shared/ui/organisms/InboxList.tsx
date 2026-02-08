import { useEffect, useMemo, useRef, useState } from 'react'
import { sendReadReceipt, useChatStore } from '@minicom/shared'
import { InboxListItem } from '../molecules/InboxListItem'

export function InboxList({
  activeThreadId,
  onSelect
}: {
  activeThreadId?: string
  onSelect: (id: string) => void
}) {
  const threadMap = useChatStore((s) => s.threads)
  const messageMap = useChatStore((s) => s.messages)
  const markRead = useChatStore((s) => s.markThreadRead)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const threads = useMemo(() => {
    return Object.values(threadMap).sort((a, b) => {
      if (a.unreadCountByAgent !== b.unreadCountByAgent) {
        return b.unreadCountByAgent - a.unreadCountByAgent
      }
      return b.lastMessageAt - a.lastMessageAt
    })
  }, [threadMap])

  const lastMessagePreview = useMemo(() => {
    const previewMap: Record<string, string> = {}
    for (const thread of threads) {
      const messages = messageMap[thread.id]
      if (messages && messages.length > 0) {
        previewMap[thread.id] = messages[messages.length - 1].body
      } else {
        previewMap[thread.id] = "No messages yet"
      }
    }
    return previewMap
  }, [messageMap, threads])

  useEffect(() => {
    const activeIndex = threads.findIndex((thread) => thread.id === activeThreadId)
    const nextIndex = activeIndex >= 0 ? activeIndex : 0
    setFocusedIndex(nextIndex)
  }, [activeThreadId, threads])

  useEffect(() => {
    itemRefs.current[focusedIndex]?.focus()
  }, [focusedIndex, threads.length])

  const handleSelect = (threadId: string) => {
    if (threadId !== activeThreadId) {
      if ((threadMap[threadId]?.unreadCountByAgent ?? 0) > 0) {
        sendReadReceipt(threadId, 'agent')
      }
      markRead(threadId)
    }
    onSelect(threadId)
  }

  const handleClick = (threadId: string, index: number) => {
    setFocusedIndex(index)
    itemRefs.current[index]?.focus()
    handleSelect(threadId)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (threads.length === 0) return
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const nextIndex = Math.min(focusedIndex + 1, threads.length - 1)
        setFocusedIndex(nextIndex)
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const nextIndex = Math.max(focusedIndex - 1, 0)
        setFocusedIndex(nextIndex)
        break
      }
      case 'Home': {
        event.preventDefault()
        setFocusedIndex(0)
        break
      }
      case 'End': {
        event.preventDefault()
        setFocusedIndex(threads.length - 1)
        break
      }
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const thread = threads[focusedIndex]
        if (thread) {
          handleSelect(thread.id)
        }
        break
      }
    }
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto" role="listbox" aria-label="Inbox threads">
      {threads.map((thread, index) => (
        <InboxListItem
          key={thread.id}
          thread={thread}
          lastMessage={lastMessagePreview[thread.id]}
          active={thread.id === activeThreadId}
          tabIndex={index === focusedIndex ? 0 : -1}
          onFocus={() => setFocusedIndex(index)}
          onKeyDown={handleKeyDown}
          onClick={() => handleClick(thread.id, index)}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
        />
      ))}
    </div>
  )
}
