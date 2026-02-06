import * as React from "react";

type TypingIndicatorProps = {
  label?: string;
  className?: string;
};

export function TypingIndicator({ label = "Typing", className }: TypingIndicatorProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full border border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 py-1 text-xs text-[var(--mc-text-muted)]";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-label={label}>
      <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--mc-text-muted)] [animation-delay:-0.2s]" />
      <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--mc-text-muted)] [animation-delay:-0.1s]" />
      <span className="flex h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--mc-text-muted)]" />
      <span>{label}</span>
    </div>
  );
}

export type { TypingIndicatorProps };
