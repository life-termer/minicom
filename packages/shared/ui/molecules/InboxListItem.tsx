import * as React from "react";
import { Thread } from "@minicom/shared";
import { UnreadBadge } from "../atoms/UnreadBadge";

type InboxListItemProps = {
  thread: Thread;
  lastMessage?: string;
  active: boolean;
  onClick: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: () => void;
  tabIndex?: number;
};

export const InboxListItem = React.forwardRef<HTMLButtonElement, InboxListItemProps>(
  ({ thread, lastMessage, active, onClick, onKeyDown, onFocus, tabIndex }, ref) => {
    return (
      <button
        ref={ref}
        id={`inbox-thread-${thread.id}`}
        type="button"
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        tabIndex={tabIndex}
        role="option"
        aria-selected={active}
        className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
          active
            ? "border-(--mc-primary) bg-(--mc-bg)"
            : "border-(--mc-border) bg-white/15 hover:bg-(--mc-bg)"
        }`}
      >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold">Visitor</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {thread.unreadCountByAgent > 0 && 
          <UnreadBadge count={thread.unreadCountByAgent} />}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-1 text-xs text-(--mc-text-muted)">
            {lastMessage ?? "No messages yet"}
          </p>
        </div>
        <p className="whitespace-nowrap text-[10px] text-(--mc-text-muted)">
          {new Date(thread.lastMessageAt).toLocaleTimeString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>
      </button>
    );
  }
)

InboxListItem.displayName = "InboxListItem";
