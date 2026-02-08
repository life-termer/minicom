"use client";

import * as React from "react";

import { nanoid } from "nanoid";
import { Message, MessageStatus, sendMessageOptimistic, useChatStore } from "@minicom/shared";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { debouncedTyping } from "../../services/typing";

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
    sendMessageOptimistic(message);
    debouncedTyping({
      threadId,
      authorId,
      isTyping: false,
    });
    setValue("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    debouncedTyping({
      threadId,
      authorId,
      isTyping: e.target.value.length > 0,
    });
  };

  const handleBlur = () => {
    debouncedTyping({
      threadId,
      authorId,
      isTyping: false,
    });
  };

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
    "flex items-center gap-2 border-t border-[var(--mc-border)] bg-[var(--mc-bg)] px-3 py-2 mt-auto";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-label="Chat message"
      />
      <Button type="submit" size="sm" disabled={!value.trim()} aria-label="Send message">
        Send
      </Button>
    </form>
  );
}

export type { ChatInputProps };
