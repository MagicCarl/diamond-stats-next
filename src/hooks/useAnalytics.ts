"use client";

import { useCallback } from "react";
import { useApi } from "./useApi";

type EventType =
  | "LOGIN"
  | "PAGE_VIEW"
  | "GAME_CREATED"
  | "PAYMENT_TOGGLED"
  | "TEAM_CREATED"
  | "SIGNUP";

export function useAnalytics() {
  const { apiFetch } = useApi();

  const trackEvent = useCallback(
    (eventType: EventType, metadata?: Record<string, unknown>) => {
      // Fire and forget — don't block UI
      apiFetch("/api/analytics/events", {
        method: "POST",
        body: JSON.stringify({ eventType, metadata }),
      }).catch(() => {
        // Silently fail — analytics should never break the app
      });
    },
    [apiFetch]
  );

  return { trackEvent };
}
