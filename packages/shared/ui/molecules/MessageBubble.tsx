import * as React from "react";

type MessageBubbleProps = {
  text?: string;
  isOwn?: boolean;
  timestamp?: string;
  status?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function MessageBubble({
  text,
  isOwn = false,
  timestamp,
  status,
  className,
  children,
}: MessageBubbleProps) {
  const align = isOwn ? "justify-end" : "justify-start";
  const bubble = isOwn
    ? "bg-[var(--mc-ring)]  text-[var(--mc-text)] border border-[var(--mc-border)]"
    : "bg-[var(--mc-bg-muted)] text-[var(--mc-text)] border border-[var(--mc-border)]";

  return (
    <div className={`flex ${align}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${bubble} ${
          className ?? ""
        }`}
      >
        {children ?? <p className="whitespace-pre-wrap">{text}</p>}
        {(timestamp || status) && (
          <div className="mt-1 flex items-center justify-end gap-2 text-[11px] 'text-[var(--foreground)]" >
            {timestamp && <span>{timestamp}</span>}
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

export type { MessageBubbleProps };
