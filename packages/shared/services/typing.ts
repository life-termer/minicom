import { debounce } from "lodash";
import { sendTyping } from "./sendTyping";

type TypingPayload = {
  threadId: string;
  authorId: string;
  isTyping: boolean;
};

export const debouncedTyping = debounce(
  (payload: TypingPayload) => {
    sendTyping({
      threadId: payload.threadId,
      participantId: payload.authorId,
      isTyping: payload.isTyping,
      updatedAt: Date.now(),
    });
  },
  300
);