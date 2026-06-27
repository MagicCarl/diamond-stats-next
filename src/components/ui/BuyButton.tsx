"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useApi } from "@/hooks/useApi";

/**
 * Starts a Stripe Checkout session for the $39 one-time purchase.
 * - Logged-in users → redirected straight to Stripe's hosted checkout.
 * - Logged-out users → sent to /signup first (a payment must be tied to an
 *   account so the webhook can grant access to the right user).
 */
export default function BuyButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { user } = useAuth();
  const { apiFetch } = useApi();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push("/signup?intent=buy");
      return;
    }
    setLoading(true);
    try {
      const { url } = await apiFetch("/api/checkout", { method: "POST" });
      if (url) {
        window.location.href = url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "…" : children}
    </button>
  );
}
