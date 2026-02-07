import React from "react";
import { Button } from "../atoms/Button";
import { ThemeToggle } from "../atoms/ThemeToggle";

type DashboardHeaderProps = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function DashboardHeader({
  isDark,
  setIsDark,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
        <div>
        <p className="text-sm font-semibold">Agent Inbox</p>
        <p className="text-xs text-[var(--mc-text-muted)]">
            {/* All open conversations · {threads.length} active */}
        </p>
        </div>
        <div className="flex items-center gap-2">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
        <Button size="sm" variant="outline">
            New ticket
        </Button>
        <Button size="sm">Assign</Button>
        </div>
    </div>
  );
}
