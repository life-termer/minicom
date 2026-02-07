import * as React from "react";

type DeliveryStatusType = "sending" | "sent" | "delivered" | "read" | "failed";

type DeliveryStatusProps = {
  status: DeliveryStatusType;
  className?: string;
};

const statusLabels: Record<DeliveryStatusType, string> = {
  sending: "Sending…",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
};

const statusClasses: Record<DeliveryStatusType, string> = {
  sending: "text-[var(--mc-text-muted)]",
  sent: "text-[var(--mc-text-muted)]",
  delivered: "text-[var(--mc-accent)]",
  read: "text-[var(--mc-success)]",
  failed: "text-[var(--mc-danger)]",
};

export function DeliveryStatus({ status, className }: DeliveryStatusProps) {
  const base = "inline-flex items-center gap-1 text-[11px]";
  const classes = [base, statusClasses[status], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}

export type { DeliveryStatusProps, DeliveryStatusType };
