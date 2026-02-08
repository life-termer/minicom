"use client";

import * as React from "react";
import { AgentDashboardLayout } from "../../../packages/shared/ui/templates/AgentDashboardLayout";
import DashboardHeader from "@minicom/shared/ui/molecules/DashboardHeader";
import { InboxList } from "../../../packages/shared/ui/organisms/InboxList";
import { ThreadView } from "../../../packages/shared/ui/organisms/ThreadView";
import { bindRealtime, sendPresence } from "@minicom/shared";
import { Input } from "@minicom/shared/ui";

export default function Home() {
  const [sortMode, setSortMode] = React.useState<"recent" | "unread">("recent");
  const [activeThreadId, setActiveThreadId] = React.useState<string>();
  const [query, setQuery] = React.useState("");
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = bindRealtime({ currentUserId: "agent" });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    sendPresence("agent", "online");

    const heartbeat = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendPresence("agent", "online");
      }
    }, 5000);

    const handlePageHide = () => {
      sendPresence("agent", "offline");
    };

    const handleVisibilityChange = () => {
      sendPresence(
        "agent",
        document.visibilityState === "hidden" ? "offline" : "online",
      );
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(heartbeat);
      sendPresence("agent", "offline");
    };
  }, []);
  React.useEffect(() => {
    const root = document.documentElement;
    const stored = root.dataset.theme;
    if (stored === "dark" || stored === "light") {
      setIsDark(stored === "dark");
      return;
    }

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(prefersDark);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDark ? "dark" : "light";
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  return (
    <AgentDashboardLayout
      header={<DashboardHeader isDark={isDark} setIsDark={setIsDark} />}
      sidebar={
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="space-y-3">
            <Input
              placeholder="Search conversations"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search conversations"
            />
            <div className="flex items-center justify-between text-xs text-(--mc-text-muted)">
              <span>Sort by</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortMode("recent")}
                  className={`rounded-full px-3 py-1 ${
                    sortMode === "recent"
                      ? "bg-(--mc-primary) text-(--mc-primary-foreground)"
                      : "text-(--mc-text-muted)"
                  }`}
                >
                  Recent
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("unread")}
                  className={`rounded-full px-3 py-1 ${
                    sortMode === "unread"
                      ? "bg-(--mc-primary) text-(--mc-primary-foreground)"
                      : "text-(--mc-text-muted)"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>
          <InboxList
            activeThreadId={activeThreadId}
            onSelect={setActiveThreadId}
          />
        </div>
      }
      content={<ThreadView threadId={activeThreadId} />}
    />
  );
}
