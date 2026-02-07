type UnreadBadgeProps = {
  count: number;
  className?: string;
};

export function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count <= 0) return null;

  const base =
    "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--mc-primary)] px-1.5 text-[11px] font-semibold text-[var(--mc-primary-foreground)]";
  const classes = [base, className].filter(Boolean).join(" ");

  return <span className={classes}>{count}</span>;
}

export type { UnreadBadgeProps };
