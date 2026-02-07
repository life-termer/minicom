"use client";

import * as React from "react";

import { MessageBubble } from "../molecules/MessageBubble";
import { Message } from "@minicom/shared";

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
  className?: string;
};

export function MessageList({ messages, currentUserId, className }: MessageListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const base = "flex flex-col gap-5";
  const classes = [base, className].filter(Boolean).join(" ");

  // Auto-scroll on new message
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={containerRef} className={classes} role="list" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
          timestamp={new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        />
      ))}
    </div>
  );
}

export type { MessageListProps, Message };
