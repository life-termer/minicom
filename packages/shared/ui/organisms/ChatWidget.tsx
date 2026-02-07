import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "@minicom/shared/stores/chatStore";
import { generateId, Message, MessageStatus, ParticipantRole } from "@minicom/shared";
import { ChatWidgetHeader } from "../molecules/ChatWidgetHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "../molecules/ChatInput";

export function ChatWidget({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  //   const [open, setOpen] = useState(false)
  const [threadId, setThreadId] = useState<string>("");
  const emptyMessages = useMemo<Message[]>(() => [], []);
  // Access the initThread action from the chat store to initialize a new thread when the widget is opened. This allows us to set up the necessary thread metadata in the store before any messages are sent. By centralizing thread initialization in the store, we ensure that all thread-related state is managed consistently and can be easily accessed by other components (like MessageList) that need to read thread data. This also simplifies our component logic, as we can rely on the store to handle all thread state management.
  const initThread = useChatStore((s) => s.initThread);
  const addMessage = useChatStore((s) => s.addMessage);

  useEffect(() => {
    if (!isOpen || threadId) return;
    // For simplicity, we create a new thread every time the widget is opened. In a real app, you'd want to check if there's an existing thread for this user and reuse it.
    const id = generateId();
    setThreadId(id);
    // Initialize the thread in the store with the visitor and a placeholder agent. In a real app, you'd fetch the agent info from your backend.
    initThread({
      id,
      participants: [
        { id: "visitor", role: ParticipantRole.VISITOR },
        { id: "agent", role: ParticipantRole.AGENT },
      ],
      lastMessageAt: Date.now(),
      unreadCountByAgent: 0,
    });
    addMessage({
      id: generateId(),
      threadId: id,
      senderId: "agent",
      body: "Hi! Welcome to MiniCom. How can we help today?",
      createdAt: Date.now(),
      status: MessageStatus.SENT,
    });
  }, [isOpen, threadId, initThread, addMessage]);

  if (!isOpen) return null;

  const messages = useChatStore(
    (s) => s.messages[threadId ?? ""] || emptyMessages,
  );

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[320px] overflow-hidden rounded-3xl border border-[var(--mc-border)] bg-[var(--mc-bg)] shadow-2xl">
      <ChatWidgetHeader onClose={onClose} />
      <div className="max-h-[320px] space-y-3 overflow-y-auto px-5 py-5">
        <MessageList messages={messages} currentUserId="visitor" />
      </div>
      <ChatInput
        threadId={threadId}
        authorId="visitor"
        placeholder="Type a message…"
      />
    </div>
  );
}
