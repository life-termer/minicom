"use client";

import * as React from "react";

import {
  Avatar,
  Badge,
  Button,
  ChatInput,
  ChatLayout,
  DeliveryStatus,
  IconButton,
  Input,
  MessageBubble,
  MessageList,
  Spinner,
  TypingIndicator,
  UnreadBadge,
} from "../../../../packages/shared/ui";

const demoMessages = [
  {
    id: "d1",
    text: "Hi! I need help with my billing details.",
    from: "visitor" as const,
    time: "10:12",
    status: "read" as const,
  },
  {
    id: "d2",
    text: "I can help with that. Do you want a summary or a quick call?",
    from: "agent" as const,
    time: "10:13",
  },
];

export default function ShowcasePage() {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <ChatLayout
      header={
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Shared UI Showcase</p>
            <p className="text-xs text-[var(--mc-text-muted)]">
              Atomic components in a mini chat experience
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Online</Badge>
            <UnreadBadge count={3} />
          </div>
        </div>
      }
      sidebar={
        <div className="flex flex-1 flex-col gap-6 p-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--mc-text-muted)]">
              Quick actions
            </p>
            <Button size="sm">Create ticket</Button>
            <Button variant="outline" size="sm">
              Assign agent
            </Button>
            <Button variant="ghost" size="sm">
              View account
            </Button>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-[var(--mc-text-muted)]">
              Status
            </p>
            <div className="flex items-center justify-between rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 py-2">
              <div>
                <p className="text-sm font-semibold">Response SLA</p>
                <p className="text-xs text-[var(--mc-text-muted)]">2m 10s</p>
              </div>
              <Spinner size="sm" />
            </div>
          </div>
        </div>
      }
      composer={
        <ChatInput
          onSend={() => undefined}
          className="rounded-b-3xl border-t border-[var(--mc-border)]"
        />
      }
      className="bg-[var(--mc-bg)]"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar fallback="AL" />
                <div>
                  <p className="text-sm font-semibold">Amara Lane</p>
                  <p className="text-xs text-[var(--mc-text-muted)]">
                    Citylane · Growth plan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton aria-label="Call">📞</IconButton>
                <IconButton aria-label="Video">🎥</IconButton>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <MessageList messages={demoMessages} ownSide="agent" />
              <MessageBubble isOwn text="Here is a quick summary with steps." timestamp="10:14">
                <div className="space-y-2 text-sm">
                  <p>We can update billing under Settings → Plans.</p>
                  <div className="flex items-center gap-2">
                    <Badge>Help center</Badge>
                    <DeliveryStatus status="delivered" />
                  </div>
                </div>
              </MessageBubble>
              <TypingIndicator label="Avery is typing" />
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-5">
            <p className="text-sm font-semibold">Inputs</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input placeholder="Search conversations" />
              <Input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Update notes"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-5">
            <p className="text-sm font-semibold">Buttons</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-5">
            <p className="text-sm font-semibold">Badges</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-5">
            <p className="text-sm font-semibold">Avatars + status</p>
            <div className="mt-3 flex items-center gap-4">
              <Avatar fallback="MC" />
              <Avatar
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                size="lg"
              />
              <div className="space-y-1">
                <DeliveryStatus status="sent" />
                <DeliveryStatus status="read" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </ChatLayout>
  );
}
