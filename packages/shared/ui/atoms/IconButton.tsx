import * as React from "react";

type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: IconButtonSize;
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function IconButton({
  className,
  size = "md",
  ...props
}: IconButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md border border-[var(--mc-border)] bg-[var(--mc-bg)] text-[var(--mc-text)] transition hover:bg-[var(--mc-bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mc-bg)] disabled:pointer-events-none disabled:opacity-50";

  const classes = [base, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}

export type { IconButtonProps, IconButtonSize };
