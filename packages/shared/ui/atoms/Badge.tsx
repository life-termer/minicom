import * as React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--mc-bg-muted)] text-[var(--mc-text)]",
  primary: "bg-[var(--mc-primary)] text-[var(--mc-primary-foreground)]",
  success: "bg-[var(--mc-success)] text-[var(--mc-success-foreground)]",
  warning: "bg-[var(--mc-warning)] text-[var(--mc-warning-foreground)]",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const classes = [base, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...props} />;
}

export type { BadgeProps, BadgeVariant };
