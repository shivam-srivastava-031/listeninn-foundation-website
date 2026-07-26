// ─────────────────────────────────────────────────────────────────────────────
// Tiny event bus so any page can open the AI chat widget in a specific flow.
//
// Usage from a page/button:
//   import { openChat } from "@/lib/chatBus";
//   <Button onClick={() => openChat("volunteer")}>Apply to Volunteer</Button>
//
// The AiChatWidget subscribes to these events and opens itself in the right mode.
// ─────────────────────────────────────────────────────────────────────────────

/** Flows the chat widget can be asked to open directly. */
export type ChatFlow = "menu" | "faq" | "programs" | "volunteer" | "donate" | "feedback";

const EVENT_NAME = "listeninn:open-chat";

/** Open the chat widget, optionally jumping straight into a flow (default: main menu). */
export function openChat(flow: ChatFlow = "menu"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ChatFlow>(EVENT_NAME, { detail: flow }));
}

/** Subscribe to open-chat requests. Returns an unsubscribe function. */
export function onOpenChat(handler: (flow: ChatFlow) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => handler((e as CustomEvent<ChatFlow>).detail ?? "menu");
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
