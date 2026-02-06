import * as React from "react";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md";
  label?: string;
};

const sizeClasses: Record<NonNullable<ThemeToggleProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

export function ThemeToggle({
  isDark,
  onToggle,
  className,
  size = "sm",
  label,
}: ThemeToggleProps) {
  const base =
    "inline-flex items-center justify-center rounded-full border border-[var(--mc-border)] bg-[var(--mc-bg)] text-[var(--mc-text-muted)] transition hover:text-[var(--mc-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mc-bg)]";
  const classes = [base, sizeClasses[size], className].filter(Boolean).join(" ");
  const Icon = isDark ? Sun : Moon;
  const ariaLabel = label ?? (isDark ? "Switch to light mode" : "Switch to dark mode");

  return (
    <button type="button" onClick={onToggle} className={classes} aria-label={ariaLabel}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

export type { ThemeToggleProps };
