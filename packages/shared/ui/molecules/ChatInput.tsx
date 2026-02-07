"use client";

import * as React from "react";

import { nanoid } from "nanoid";
import { useChatStore } from "@minicom/shared";
import { Message, MessageStatus } from "@minicom/shared";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

type ChatInputProps = {
  threadId: string;
  authorId: string;
  placeholder?: string;
  className?: string;
};

export function ChatInput({
  threadId, authorId,
  placeholder = "Type a message...",
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState("");

  const addMessage = useChatStore((s) => s.addMessage);

  function handleSend() {
    if (!value.trim()) return;

    const message: Message = {
      id: nanoid(),
      threadId,
      senderId: authorId,
      body: value.trim(),
      createdAt: Date.now(),
      status: MessageStatus.SENT,
    };

    addMessage(message);
    setValue("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSend();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const base =
    "flex items-center gap-2 border-t border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 py-2";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        aria-label="Chat message"
      />
      <Button type="submit" size="sm" disabled={!value.trim()} aria-label="Send message">
        Send
      </Button>
    </form>
  );
}

export type { ChatInputProps };
