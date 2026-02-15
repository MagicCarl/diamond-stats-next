"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useCallback } from "react";

export function useApi() {
  const { token } = useAuth();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      return res.json();
    },
    [token]
  );

  return { apiFetch };
}
