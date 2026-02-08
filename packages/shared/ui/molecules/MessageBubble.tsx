import * as React from "react";
import clsx from "clsx";
import { Message } from "@minicom/shared";
import { DeliveryStatus } from "./DeliveryStatus";

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
  timestamp?: string;
  className?: string;
  children?: React.ReactNode;
};

export function MessageBubble({
  message,
  isOwn = false,
  timestamp,
  className,
  children,
}: MessageBubbleProps) {
  const align = isOwn ? "justify-end" : "justify-start";
  const bubble = isOwn
    ? "bg-[var(--mc-ring)]  text-[var(--mc-text)] border border-[var(--mc-border)] aria-label='Message from you'"
    : "bg-[var(--mc-bg-muted)] text-[var(--mc-text)] border border-[var(--mc-border)]  aria-label='Message from other participant'";

  return (
    <div className={`flex ${align}`}>
      <div
        className={`max-w-[75%] min-w-36 rounded-2xl px-3 py-2 text-sm shadow-sm tabIndex={0} ${bubble} ${
          className ?? ""
        }`}
      >
        {children ?? <p className="whitespace-pre-wrap">{message.body}</p>}
        {(timestamp || (isOwn && message.status)) && (
          <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-[var(--foreground)]">
            {timestamp && <span>{timestamp}</span>}
            {isOwn && message.status && (
              <span>
                <DeliveryStatus status={message.status} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export type { MessageBubbleProps };
