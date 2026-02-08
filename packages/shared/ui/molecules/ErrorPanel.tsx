import { Button } from "../atoms/Button";

type ErrorPanelProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function ErrorPanel({
  title = "Something went wrong",
  message = "Try again or refresh the page.",
  actionLabel = "Retry",
  onAction,
  className
}: ErrorPanelProps) {
  return (
    <div
      className={[
        "rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-4 text-[var(--mc-text)] shadow-2xl",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-[var(--mc-text-muted)]">{message}</p>
      {onAction && (
        <Button size="sm" className="mt-3" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export type { ErrorPanelProps };
