import * as React from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--mc-primary)] text-[var(--mc-primary-foreground)] hover:bg-[var(--mc-primary-hover)]",
  outline:
    "border border-[var(--mc-border)] text-[var(--mc-text)] hover:bg-[var(--mc-bg-muted)]",
  ghost: "text-[var(--mc-text)] hover:bg-[var(--mc-bg-muted)]",
  danger:
    "bg-[var(--mc-danger)] text-[var(--mc-danger-foreground)] hover:bg-[var(--mc-danger-hover)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mc-bg)] disabled:pointer-events-none disabled:opacity-50 enabled:hover:cursor-pointer";

  const classes = [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}

export type { ButtonProps, ButtonVariant, ButtonSize };
