"use client";

import { useCallback } from "react";
import { auth } from "@/lib/firebase-client";

export function useApi() {
  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      // Always get a fresh token directly from Firebase Auth
      const currentUser = auth.currentUser;
      if (currentUser) {
        const freshToken = await currentUser.getIdToken();
        headers.Authorization = `Bearer ${freshToken}`;
      }

      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      return res.json();
    },
    []
  );

  return { apiFetch };
}
