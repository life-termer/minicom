import * as React from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-2",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  const base =
    "inline-block animate-spin rounded-full border-[var(--mc-border)] border-t-[var(--mc-primary)]";
  const classes = [base, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} role="status" aria-label="Loading" />;
}

export type { SpinnerProps };
