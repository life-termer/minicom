"use client";

import * as React from "react";

import {
  Avatar,
  Badge,
  Button,
  ChatWidget,
  FloatingButton,
  ThemeToggle,
} from "../../../packages/shared/ui";
import { bindRealtime } from "@minicom/shared";


const avatars = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
];

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

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

  React.useEffect(() => {
    const unsubscribe = bindRealtime({ currentUserId: "visitor" });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-(--mc-bg) text-(--mc-text)">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--mc-ring),transparent_60%)]" />
        <header className="relative mx-auto flex flex-wrap gap-y-6 w-full max-w-6xl items-center sm:justify-between  px-6 py-6">
          <div className="flex w-full md:w-auto items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--mc-primary)] text-sm font-semibold text-[var(--mc-primary-foreground)]">
              MC
            </div>
            <div>
              <p className="text-sm font-semibold">MiniCom</p>
              <p className="text-xs text-[var(--mc-text-muted)]">
                Real-time customer support
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-(--mc-text) md:flex">
            <span>Product</span>
            <span>Solutions</span>
            <span>Pricing</span>
            <span>Security</span>
          </nav>
          <div className="flex items-center justify-end gap-3 w-full md:w-auto">
            <ThemeToggle
              isDark={isDark}
              onToggle={() => setIsDark((prev) => !prev)}
            />
            <Button variant="outline" size="sm">
              Sign in
            </Button>
            <a href="/agent">
              <Button size="sm">Try a demo</Button>
            </a>
          </div>
        </header>

        <main className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pb-24 pt-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary">New</Badge>
              <span className="text-sm text-[var(--mc-text-muted)]">
                Launching shared inbox + AI summaries
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Support that feels like a real-time conversation.
              </h1>
              <p className="max-w-xl text-base text-[var(--mc-text-muted)]">
                MiniCom helps teams respond faster with smart routing,
                lightweight automations, and an interface your customers love.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Start free trial</Button>
              <Button variant="outline">View case study</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  title: "24/7 response",
                  body: "Keep SLAs green with live notifications.",
                },
                {
                  title: "Unified inbox",
                  body: "Email, chat, and socials in one place.",
                },
                {
                  title: "Secure",
                  body: "SOC 2 compliant with SSO support.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-bg-secondary)] p-4 shadow-sm"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-xs text-[var(--mc-text-muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg-secondary)] p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--mc-text-muted)]">
                    Active agents
                  </p>
                  <p className="text-2xl font-semibold">6 online</p>
                </div>
                <div className="flex -space-x-2">
                  {avatars.map((src, index) => (
                    <Avatar
                      key={src}
                      src={src}
                      size="sm"
                      className="ring-2 ring-white"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {["Billing", "Onboarding", "API Support"].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-bg)] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-[var(--mc-text-muted)]">
                        Avg. response 2m
                      </p>
                    </div>
                    <Badge variant="success">Healthy</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg-secondary)] p-6 shadow-sm">
              <p className="text-sm font-semibold">Trusted by teams</p>
              <p className="mt-3 text-xs text-[var(--mc-text-muted)]">
                "MiniCom helped us cut response times by 41% while keeping the
                tone personal."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar fallback="AL" size="sm" />
                <div>
                  <p className="text-xs font-semibold">Amara Lane</p>
                  <p className="text-[11px] text-[var(--mc-text-muted)]">
                    Support Lead, Citylane
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <FloatingButton onClick={() => setOpen((prev) => !prev)} />
      {open && <ChatWidget isOpen={open} onClose={() => setOpen(false)} />}

    </div>
  );
}
