import { test, expect } from "@playwright/test";

type PersistedState = {
  state: {
    threads: Record<string, unknown>;
    messages: Record<string, unknown>;
    typing: Record<string, unknown>;
  };
  version: number;
};

function buildSeedState(): PersistedState {
  const now = Date.now();
  const threads = {
    t1: {
      id: "t1",
      participants: [
        { id: "agent", role: "agent" },
        { id: "visitor", role: "visitor" }
      ],
      lastMessageAt: now - 1000,
      unreadCountByAgent: 2,
      unreadCountByVisitor: 0
    },
    t2: {
      id: "t2",
      participants: [
        { id: "agent", role: "agent" },
        { id: "visitor", role: "visitor" }
      ],
      lastMessageAt: now - 2000,
      unreadCountByAgent: 0,
      unreadCountByVisitor: 0
    }
  };

  const t1Messages = Array.from({ length: 30 }, (_, index) => {
    const order = index + 1;
    const isVisitor = order > 28 ? true : order % 2 === 0;
    return {
      id: `t1-m${order}`,
      threadId: "t1",
      senderId: isVisitor ? "visitor" : "agent",
      body: `Message ${order}`,
      createdAt: now - (30 - order) * 1000,
      status: isVisitor ? "delivered" : "read"
    };
  });

  const t2Messages = [
    {
      id: "t2-m1",
      threadId: "t2",
      senderId: "visitor",
      body: "Thread 2 - hello",
      createdAt: now - 2500,
      status: "delivered"
    },
    {
      id: "t2-m2",
      threadId: "t2",
      senderId: "agent",
      body: "Thread 2 - reply",
      createdAt: now - 2000,
      status: "read"
    }
  ];

  return {
    state: {
      threads,
      messages: {
        t1: t1Messages,
        t2: t2Messages
      },
      typing: {}
    },
    version: 0
  };
}

async function seedStore(
  page: import("@playwright/test").Page,
  seedState: PersistedState = buildSeedState()
) {
  await page.addInitScript((state) => {
    localStorage.setItem("minicom-chat-store", JSON.stringify(state));
  }, seedState);
}

test.describe("agent inbox", () => {
  test.beforeEach(async ({ page }) => {
    await seedStore(page);
    await page.goto("/");
    await page.locator("[role='listbox'] [role='option']").first().waitFor();
  });

  test("state transition: sent -> delivered on ack", async ({ page }) => {
    const options = page.locator("[role='listbox'] [role='option']");
    await options.first().click();

    const messageBody = "Status test message";
    const input = page.getByLabel("Chat message");
    await input.fill(messageBody);
    await page.keyboard.press("Enter");

    const messageId = await page.evaluate(() => {
      const raw = localStorage.getItem("minicom-chat-store");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const threadMessages = parsed?.state?.messages?.t1;
      if (!Array.isArray(threadMessages) || threadMessages.length === 0) {
        return null;
      }
      return threadMessages[threadMessages.length - 1].id as string;
    });

    if (!messageId) {
      throw new Error("Failed to resolve message id");
    }

    const statusBefore = await page.evaluate((id) => {
      const raw = localStorage.getItem("minicom-chat-store");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const threadMessages = parsed?.state?.messages?.t1;
      if (!Array.isArray(threadMessages)) return null;
      const message = threadMessages.find((entry) => entry.id === id);
      return message?.status ?? null;
    }, messageId);

    expect(statusBefore).toBe("sent");

    await page.evaluate((id) => {
      const channel = new BroadcastChannel("minicom-chat");
      channel.postMessage({
        type: "MESSAGE_ACK",
        payload: { messageId: id }
      });
      channel.close();
    }, messageId);

    await page.waitForFunction((id) => {
      const raw = localStorage.getItem("minicom-chat-store");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const threadMessages = parsed?.state?.messages?.t1;
      if (!Array.isArray(threadMessages)) return false;
      const message = threadMessages.find((entry) => entry.id === id);
      return message?.status === "delivered";
    }, messageId);
  });

  test("UI interaction: unread badge clears on selection", async ({ page }) => {
    const options = page.locator("[role='listbox'] [role='option']");
    const firstOption = options.first();
    const unreadBadge = firstOption.getByText(/^2$/);

    await expect(unreadBadge).toBeVisible();
    await firstOption.click();
    await expect(unreadBadge).toHaveCount(0);
  });

  test("edge case: empty inbox shows placeholder", async ({ page }) => {
    await seedStore(page, {
      state: {
        threads: {},
        messages: {},
        typing: {}
      },
      version: 0
    });
    await page.goto("/");

    await expect(page.getByText("Select a conversation")).toBeVisible();
    await expect(page.locator("[role='listbox'] [role='option']")).toHaveCount(0);
  });

});
