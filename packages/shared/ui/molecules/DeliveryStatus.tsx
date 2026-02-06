import * as React from "react";

type DeliveryStatusType = "sent" | "delivered" | "read";

type DeliveryStatusProps = {
  status: DeliveryStatusType;
  className?: string;
};

const statusLabels: Record<DeliveryStatusType, string> = {
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
};

const statusClasses: Record<DeliveryStatusType, string> = {
  sent: "text-[var(--mc-text-muted)]",
  delivered: "text-[var(--mc-accent)]",
  read: "text-[var(--mc-success)]",
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
