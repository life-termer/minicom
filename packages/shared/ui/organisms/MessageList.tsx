import * as React from "react";

import { MessageBubble } from "../molecules/MessageBubble";
import { DeliveryStatus, DeliveryStatusType } from "../molecules/DeliveryStatus";

type Message = {
  id: string;
  text: string;
  from: "agent" | "visitor";
  time?: string;
  status?: DeliveryStatusType;
};

type MessageListProps = {
  messages: Message[];
  ownSide?: Message["from"];
  className?: string;
};

export function MessageList({ messages, ownSide = "agent", className }: MessageListProps) {
  const base = "flex flex-col gap-3";
  const classes = [base, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          text={message.text}
          isOwn={message.from === ownSide}
          timestamp={message.time}
          status={
            message.status ? <DeliveryStatus status={message.status} /> : undefined
          }
        />
      ))}
    </div>
  );
}

export type { MessageListProps, Message };
