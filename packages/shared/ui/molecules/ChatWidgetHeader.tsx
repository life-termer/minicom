"use client";

import { X } from "lucide-react";
import { Avatar } from "../atoms/Avatar";
import { subscribe } from "@minicom/shared";
import * as React from "react";

export function ChatWidgetHeader({ onClose }: { onClose: () => void }) {
  const [isOnline, setIsOnline] = React.useState(false);

  React.useEffect(() => {
    return subscribe((event) => {
      if (event.type !== "PRESENCE") return;
      if (event.payload.participantId !== "agent") return;
      setIsOnline(event.payload.status === "online");
    });
  }, []);

  return (
    <div className="flex items-center gap-3 border-b border-[var(--mc-border)] bg-[var(--mc-bg-muted)] px-4 py-3">
      <Avatar
        src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop"
        size="md"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">Avery · Support</p>
        <p className="flex items-center gap-2 text-xs text-[var(--mc-text-muted)]">
          <span
            className={
              isOnline
                ? "h-1.5 w-1.5 rounded-full bg-[var(--mc-success)]"
                : "h-1.5 w-1.5 rounded-full bg-[var(--mc-text-muted)]"
            }
            aria-hidden="true"
          />
          {isOnline ? "Online" : "Offline"}
        </p>
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
