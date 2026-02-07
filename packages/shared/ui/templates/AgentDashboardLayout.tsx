import * as React from "react";

type AppLayoutProps = {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  content?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function AgentDashboardLayout({
  header,
  sidebar,
  content,
  children,
  className,
}: AppLayoutProps) {
  const base =
    "h-screen bg-[var(--mc-bg)] text-[var(--mc-text)] grid grid-cols-1 lg:grid-cols-[280px_1fr]";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {sidebar && (
        <aside className="hidden lg:flex flex-col border-r border-[var(--mc-border)] bg-[var(--mc-bg-muted)]">
          {sidebar}
        </aside>
      )}
      <section className="flex min-h-screen flex-col">
        {header && (
          <header className="border-b border-[var(--mc-border)] bg-[var(--mc-bg)] px-4 py-3">
            {header}
          </header>
        )}
        {/* <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main> */}
        {content}
      </section>
    </div>
  );
}

export type { AppLayoutProps };
