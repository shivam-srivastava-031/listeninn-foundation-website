import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

import "./styles.css";

// ── TEMP DIAGNOSTIC: verify VITE_GEMINI_API_KEY reaches the build (value masked) ──
// Remove after confirming. Never logs the full key.
{
  const k = import.meta.env.VITE_GEMINI_API_KEY;
  const masked = typeof k === "string" && k.length > 8 ? `${k.slice(0, 4)}…${k.slice(-2)}` : "(none)";
  // eslint-disable-next-line no-console
  console.log("[ENV CHECK] VITE_GEMINI_API_KEY present:", Boolean(k && k.length), "| length:", k?.length ?? 0, "| masked:", masked);
}

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
