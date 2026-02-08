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
            ? "border-[var(--mc-primary)] bg-[var(--mc-bg)]"
            : "border-[var(--mc-border)] bg-white/15 hover:bg-[var(--mc-bg)]"
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
          <p className="line-clamp-1 text-xs text-[var(--mc-text-muted)]">
            {lastMessage ?? "No messages yet"}
          </p>
        </div>
        <p className="whitespace-nowrap text-[10px] text-[var(--mc-text-muted)]">
          {new Date(thread.lastMessageAt).toLocaleTimeString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
        {/* {thread.status === "urgent" ? (
          <Badge variant="warning">Urgent</Badge>
        ) : (
          <Badge>Open</Badge>
        )} */}
      </div>
      </button>
    // <li
    //   tabIndex={0}
    //   role="option"
    //   aria-selected={active}
    //   onClick={onClick}
    //   className={`p-3 border-b cursor-pointer focus:outline-none focus:ring-2 ${
    //     active ? 'bg-gray-100' : ''
    //   }`}
    // >
    //   <div className="flex justify-between">
    //     <span className="font-medium">Visitor</span>
    //     {thread.unreadCountByAgent > 0 && (
    //       <span className="text-xs bg-blue-600 text-white rounded-full px-2">
    //         {thread.unreadCountByAgent}
    //       </span>
    //     )}
    //   </div>
    //   <p className="text-sm text-gray-500 truncate">
    //     Last message…
    //   </p>
    // </li>
    );
  }
)

InboxListItem.displayName = "InboxListItem";
