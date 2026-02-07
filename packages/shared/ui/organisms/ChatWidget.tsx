import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "@minicom/shared/stores/chatStore";
import {
  generateId,
  Message,
  MessageStatus,
  ParticipantRole,
  sendEvent,
} from "@minicom/shared";
import { Button } from "../atoms/Button";
import { ChatWidgetHeader } from "../molecules/ChatWidgetHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "../molecules/ChatInput";
import { TypingIndicator } from "../atoms/TypingIndicator";

export function ChatWidget({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
 
  const [threadId, setThreadId] = useState<string>("");
  const hasInitializedRef = useRef(false);
  const emptyMessages = useMemo<Message[]>(() => [], []);
  const threadMap = useChatStore((s) => s.threads);
  const existingThreadId = useMemo(() => {
    let latestId = "";
    let latestTime = 0;
    for (const thread of Object.values(threadMap)) {
      if (thread.lastMessageAt >= latestTime) {
        latestTime = thread.lastMessageAt;
        latestId = thread.id;
      }
    }
    return latestId;
  }, [threadMap]);
  // Access the initThread action from the chat store to initialize a new thread when the widget is opened. This allows us to set up the necessary thread metadata in the store before any messages are sent. By centralizing thread initialization in the store, we ensure that all thread-related state is managed consistently and can be easily accessed by other components (like MessageList) that need to read thread data. This also simplifies our component logic, as we can rely on the store to handle all thread state management.
  const initThread = useChatStore((s) => s.initThread);
  const addMessage = useChatStore((s) => s.addMessage);
  const markThreadReadByVisitor = useChatStore((s) => s.markThreadReadByVisitor);

  const createThread = () => {
    const id = generateId();
    setThreadId(id);
    const thread = {
      id,
      participants: [
        { id: "visitor", role: ParticipantRole.VISITOR },
        { id: "agent", role: ParticipantRole.AGENT },
      ],
      lastMessageAt: Date.now(),
      unreadCountByAgent: 0,
      unreadCountByVisitor: 0,
    };
    initThread(thread);
    sendEvent({ type: "THREAD_INIT", payload: thread });
    addMessage({
      id: generateId(),
      threadId: id,
      senderId: "agent",
      body: "Hi! Welcome to MiniCom. How can we help today?",
      createdAt: Date.now(),
      status: MessageStatus.SENT,
    });
  };

  useEffect(() => {
    if (!isOpen || threadId) return;
    if (existingThreadId) {
      setThreadId(existingThreadId);
      return;
    }
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    // For simplicity, we create a new thread every time the widget is opened. In a real app, you'd want to check if there's an existing thread for this user and reuse it.
    createThread();
  }, [isOpen, threadId, existingThreadId, initThread, addMessage]);


  if (!isOpen) return null;

  const messages = useChatStore(
    (s) => s.messages[threadId ?? ""] || emptyMessages,
  );

  useEffect(() => {
    if (!isOpen || !threadId) return;
    if (messages.length === 0) return;
    markThreadReadByVisitor(threadId);
  }, [isOpen, threadId, messages.length, markThreadReadByVisitor]);

  const isTyping = useChatStore((s) => {
    if (!threadId) return false
    for (const key in s.typing) {
      const typing = s.typing[key]
      if (
        typing.threadId === threadId &&
        typing.isTyping &&
        typing.participantId !== "visitor"
      ) {
        return true
      }
    }
    return false
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const typingRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isTyping) return
    const container = scrollRef.current
    if (!container) return

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight

    if (distanceFromBottom <= 80) {
      typingRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }, [isTyping])

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[calc(100%-3rem)] sm:w-[320px] overflow-hidden rounded-3xl border border-(--mc-border) bg-(--mc-bg) shadow-2xl">
      <ChatWidgetHeader onClose={onClose} />
      <div className="flex items-center justify-between border-b border-(--mc-border) px-4 py-2">
        <p className="text-xs text-(--mc-text-muted)">Testing tools</p>
        <Button size="sm" variant="outline" onClick={createThread}>
          New thread
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="max-h-[320px] space-y-3 overflow-y-auto px-5 py-5"
      >
        <MessageList messages={messages} currentUserId="visitor" />
        {isTyping && (
          <div ref={typingRef}>
            <TypingIndicator label="Agent is typing..." />
          </div>
        )}
      </div>
      <ChatInput
        threadId={threadId}
        authorId="visitor"
        placeholder="Type a message…"
      />
    </div>
  );
}
