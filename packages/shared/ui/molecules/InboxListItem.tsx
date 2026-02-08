import { Thread, useChatStore } from "@minicom/shared";
import { UnreadBadge } from "../atoms/UnreadBadge";

export function InboxListItem({
  thread,
  active,
  onClick,
}: {
  thread: Thread;
  active: boolean;
  onClick: () => void;
}) {
  const unreadCount = useChatStore((s) => {
      let total = 0
      for (const thread of Object.values(s.threads)) {
        total += thread.unreadCountByAgent || 0
      }
      return total
    })
  return (
    <button
      key={thread.id}
      type="button"
      onClick={onClick}
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
        <p className="line-clamp-1 text-xs text-[var(--mc-text-muted)]">
          {new Date(thread.lastMessageAt).toLocaleTimeString([], { year: "numeric",
  month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
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
