import { useChatStore } from "@minicom/shared";
import { UnreadBadge } from "../atoms/UnreadBadge";

export function FloatingButton({ onClick }: { onClick: () => void }) {
  const unreadCount = useChatStore((s) => {
    let total = 0
    for (const thread of Object.values(s.threads)) {
      total += thread.unreadCountByVisitor || 0
    }
    return total
  })

  return (
    <button
      aria-label="Open chat"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mc-primary)] text-[var(--mc-primary-foreground)] shadow-xl transition hover:translate-y-[-2px]"
    >
      <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
          <span className="absolute -right-3 -top-3">
            <UnreadBadge count={unreadCount} />
          </span>
        </span>
    </button>
  )
}
