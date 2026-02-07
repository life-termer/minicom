import { X } from "lucide-react";
import { Avatar } from "../atoms/Avatar";

export function ChatWidgetHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--mc-border)] bg-[var(--mc-bg-muted)] px-4 py-3">
      <Avatar
        src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop"
        size="md"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">Avery · Support</p>
        <p className="text-xs text-[var(--mc-text-muted)]">Online now</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-[var(--mc-text-muted)] hover:cursor-pointer hover:text-[var(--mc-text)]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
