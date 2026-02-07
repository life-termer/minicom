"use client";

import * as React from "react";
import { AgentDashboardLayout } from "../../../packages/shared/ui/templates/AgentDashboardLayout";
import { InboxList } from "../../../packages/shared/ui/organisms/InboxList";
import { ThreadView } from "../../../packages/shared/ui/organisms/ThreadView";
import { bindRealtime } from "@minicom/shared";

type ThreadMessage = {
  id: string;
  text: string;
  from: "agent" | "visitor";
  time: string;
  status?: "sent" | "delivered" | "read";
};

type Thread = {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  lastUpdated: string;
  unread: number;
  status: "open" | "urgent";
  messages: ThreadMessage[];
};

const threads: Thread[] = [
  {
    id: "t1",
    name: "Amara Lane",
    company: "Citylane",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    lastMessage: "Need help syncing CRM data with MiniCom.",
    lastTime: "09:41",
    lastUpdated: "2026-02-06T09:41:00",
    unread: 2,
    status: "urgent",
    messages: [
      {
        id: "m1",
        text: "Hi! Our CRM sync looks delayed today.",
        from: "visitor",
        time: "09:39",
        status: "read",
      },
      {
        id: "m2",
        text: "I can check the pipeline. Which workspace?",
        from: "agent",
        time: "09:40",
        status: "read",
      },
      {
        id: "m3",
        text: "Citylane-prod. Looks like webhooks are queued.",
        from: "visitor",
        time: "09:41",
      },
    ],
  },
  {
    id: "t2",
    name: "Jules Cortez",
    company: "NovaPay",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    lastMessage: "Thanks! The invoice update works now.",
    lastTime: "09:32",
    lastUpdated: "2026-02-06T09:32:00",
    unread: 0,
    status: "open",
    messages: [
      {
        id: "m1",
        text: "We can update your invoice template in Settings.",
        from: "agent",
        time: "09:30",
        status: "read",
      },
      {
        id: "m2",
        text: "Thanks! The invoice update works now.",
        from: "visitor",
        time: "09:32",
      },
    ],
  },
  {
    id: "t3",
    name: "Priya Shah",
    company: "Orbital",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop",
    lastMessage: "Is SSO available for the Growth plan?",
    lastTime: "09:18",
    lastUpdated: "2026-02-06T09:18:00",
    unread: 1,
    status: "open",
    messages: [
      {
        id: "m1",
        text: "Is SSO available for the Growth plan?",
        from: "visitor",
        time: "09:18",
      },
      {
        id: "m2",
        text: "Yes, we support Okta and Azure AD on Growth.",
        from: "agent",
        time: "09:19",
        status: "delivered",
      },
    ],
  },
];

export default function Home() {
  const [activeId, setActiveId] = React.useState(threads[0]?.id ?? "");
  const [sortMode, setSortMode] = React.useState<"recent" | "unread">(
    "recent"
  );
  const [activeThreadId, setActiveThreadId] = React.useState<string>()
  const [query, setQuery] = React.useState("");
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = bindRealtime()
    return unsubscribe
  }, [])
  React.useEffect(() => {
    const root = document.documentElement;
    const stored = root.dataset.theme;
    if (stored === "dark" || stored === "light") {
      setIsDark(stored === "dark");
      return;
    }

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(prefersDark);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDark ? "dark" : "light";
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  const filteredThreads = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byQuery = normalized
      ? threads.filter(
          (thread) =>
            thread.name.toLowerCase().includes(normalized) ||
            thread.company.toLowerCase().includes(normalized)
        )
      : threads;

    return [...byQuery].sort((a, b) => {
      if (sortMode === "unread") {
        if (a.unread !== b.unread) return b.unread - a.unread;
      }

      return (
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    });
  }, [query, sortMode]);

  const activeThread =
    threads.find((thread) => thread.id === activeId) ?? threads[0];

  return (
  <AgentDashboardLayout
      sidebar={
        <InboxList
          activeThreadId={activeThreadId}
          onSelect={setActiveThreadId}
        />
      }
      content={<ThreadView threadId={activeThreadId} />}
    />
  );
}
