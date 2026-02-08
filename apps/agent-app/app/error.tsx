"use client";

import * as React from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Agent app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] text-[var(--mc-text)] ">
      <div className="mx-auto flex  max-w-2xl flex-col gap-3 px-6 py-12">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-[var(--mc-text-muted)]">
          Try the action again. If it keeps happening, refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="w-fit rounded-md bg-[var(--mc-primary)] px-4 py-2 text-sm font-semibold text-[var(--mc-primary-foreground)]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
