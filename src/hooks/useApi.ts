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

      const res = await fetch(url, { ...options, headers, cache: "no-store" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        const err = new Error(body.error || `HTTP ${res.status}`) as Error & {
          status?: number;
          code?: string;
        };
        err.status = res.status;
        err.code = body.code;
        throw err;
      }

      return res.json();
    },
    []
  );

  return { apiFetch };
}
