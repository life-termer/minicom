"use client";

import * as React from "react";

import { MessageBubble } from "../molecules/MessageBubble";
import { Message, MessageStatus, sendMessageOptimistic } from "@minicom/shared";
import { useChatStore } from "@minicom/shared/stores/chatStore";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  className?: string;
};

const PAGE_SIZE = 20;

export function MessageList({ messages, currentUserId, className }: MessageListProps) {
  const endRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const base = "flex flex-col gap-5";
  const classes = [base, className].filter(Boolean).join(" ");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const visibleMessages = messages.slice(-visibleCount);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;

    if (el.scrollTop === 0 && visibleCount < messages.length) {
      setVisibleCount((count) =>
        Math.min(count + PAGE_SIZE, messages.length)
      );
    }
  }

  // Auto-scroll on new message
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages.length]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto space-y-3 px-5 py-5" onScroll={handleScroll} >
    <div className={classes} role="list" aria-live="polite" >
      {visibleMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
          timestamp={new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          onRetry={(retryMessage) => {
            updateMessageStatus(retryMessage.id, MessageStatus.SENT);
            sendMessageOptimistic({
              ...retryMessage,
              status: MessageStatus.SENT
            });
          }}
        />
      ))}
      <div ref={endRef} />
    </div>
    </div>
  );
}

export type { MessageListProps, Message };
