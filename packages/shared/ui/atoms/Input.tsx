import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const base =
      "h-10 w-full rounded-md border border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 text-sm text-[var(--mc-text)] placeholder:text-[var(--mc-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mc-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mc-bg)]";

    const classes = [base, className].filter(Boolean).join(" ");

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";

export type { InputProps };
