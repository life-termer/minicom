"use client";

import * as React from "react";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

type ChatInputProps = {
  placeholder?: string;
  onSend?: (message: string) => void;
  className?: string;
};

export function ChatInput({
  placeholder = "Type a message...",
  onSend,
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend?.(trimmed);
    setValue("");
  };

  const base =
    "flex items-center gap-2 border-t border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 py-2";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Chat message"
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        Send
      </Button>
    </form>
  );
}

export type { ChatInputProps };
