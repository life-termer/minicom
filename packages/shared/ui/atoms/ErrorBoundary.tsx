"use client";

import * as React from "react";

const defaultFallback = (
  <div className="fixed left-5 bottom-20 max-w-60 m-auto rounded-2xl border border-[var(--mc-border)] bg-[var(--mc-bg)] p-4 text-sm text-[var(--mc-text)]">
    <p className="font-semibold">Something went wrong.</p>
    <p className="mt-1 text-xs text-[var(--mc-text-muted)]">
      Try again or refresh the page.
    </p>
  </div>
);

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((options: { reset: () => void }) => React.ReactNode);
  resetKey?: string | number;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  private reset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({ reset: this.reset });
      }
      return this.props.fallback ?? defaultFallback;
    }

    return this.props.children;
  }
}
