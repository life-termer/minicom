import { Thread } from '@minicom/shared'

export function InboxListItem({
  thread,
  active,
  onClick
}: {
  thread: Thread
  active: boolean
  onClick: () => void
}) {
  return (
    <li
      tabIndex={0}
      role="option"
      aria-selected={active}
      onClick={onClick}
      className={`p-3 border-b cursor-pointer focus:outline-none focus:ring-2 ${
        active ? 'bg-gray-100' : ''
      }`}
    >
      <div className="flex justify-between">
        <span className="font-medium">Visitor</span>
        {thread.unreadCountByAgent > 0 && (
          <span className="text-xs bg-blue-600 text-white rounded-full px-2">
            {thread.unreadCountByAgent}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 truncate">
        Last message…
      </p>
    </li>
  )
}
