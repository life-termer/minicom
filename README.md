# MiniCom

MiniCom is a live chat support demo with an agent inbox and a visitor widget. It focuses on real-time messaging, optimistic UI, message delivery states, and lightweight presence.

---

## Project Overview

- Two apps in a single repository:
  - **visitor-app** – a mock marketing page with an embedded chat widget
  - **agent-app** – an agent inbox with conversation threads
- Shared code lives in `packages/shared`:
  - domain models
  - Zustand store
  - real-time services
  - reusable UI components (atomic design)
- Real-time communication is simulated using the browser’s `BroadcastChannel`
- For production deployment, the agent app is also accessible under `/agent` on the same domain so both apps can communicate via BroadcastChannel

---

## Architecture Diagram (Text)

```
visitor-app (ChatWidget) ──┐
													 │  BroadcastChannel (minicom-chat)
agent-app (Inbox/Thread) ──┘

packages/shared
	├─ models (Message, Thread, TypingState)
	├─ constants (MessageStatus, ParticipantRole)
	├─ services (sendMessage, bindRealtime, presence, read)
	├─ stores (chatStore with Zustand + persist)
	└─ ui (atoms/molecules/organisms)
```

---

## State Management Choices and Trade-offs

### Zustand + persist

- Used for chat state, messages, threads, and unread counts
- Persisted to `localStorage` so conversations survive reloads and widget close
- Chosen for its simplicity, low boilerplate, and clear action-based updates

**Trade-off:**  
`localStorage` is shared across tabs, which can introduce subtle edge cases in a multi-app setup. These were handled carefully but would not be ideal in a real multi-user backend system.

---

### BroadcastChannel

- Used to simulate real-time messaging between visitor and agent
- Zero backend dependency
- Instant cross-app updates

**Trade-off:**  
Same-origin only and browser-scoped — suitable for demos, not for production chat systems.

---

### Message Flow (Simplified)

1. Sender creates a message optimistically (`sending`)
2. Receiver gets the message → status becomes `delivered`, unread count increments
3. Receiver opens the thread → sender messages update to `read`

---

## How AI Helped

AI was used **extensively and intentionally** throughout this project, mainly to help with architecture decisions like state management, data flow, and real-time behavior.

I’m a mid-level frontend developer, and this task clearly goes into senior-level territory. Some parts of the system were outside my usual day-to-day work, so I used AI as a learning partner to think through solutions, double-check decisions, and avoid obvious mistakes while working under time pressure.

AI helped me:

- Think through **message status transitions** (`sending → sent → delivered → read`)
- Design a **store structure** that supports unread counts, read receipts, and optimistic updates
- Identify tricky **edge cases**, such as ACKs arriving out of order or shared persistence across apps
- Speed up iteration while still understanding and refining the final solution

Example prompts I used:

- “Where should optimistic state live in a real-time chat app?”
- “How should unread counts update without double counting?”
- “How do I prevent a READ status from being overwritten by a later ACK?”

I reviewed, adjusted, and simplified AI-generated ideas to fit my own understanding and the scope of this project. AI didn’t replace understanding — it helped me learn faster and try patterns I’m actively growing into. This project reflects both where I am today as a developer and my motivation to take on bigger challenges, learn from them, and keep improving.

---

## Improvements With More Time

- Replace `BroadcastChannel` with a real backend (WebSockets + server persistence)
- Add proper message list virtualization with dynamic row heights
- Implement retry logic with exponential backoff and error analytics
- Expand automated tests for cross-app and lifecycle edge cases
- Further accessibility improvements (ARIA roles for message status, keyboard hints)

---

## Running Locally

```bash
npm install
npm run dev:agent
npm run dev:visitor
```

## Deployment

Visitor: https://minicom-visitor-app.vercel.app/\
Agent (same origin): https://minicom-visitor-app.vercel.app/agent
