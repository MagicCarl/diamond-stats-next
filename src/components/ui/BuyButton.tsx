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
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (!user) {
      router.push("/signup?intent=buy");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { url } = await apiFetch("/api/checkout", { method: "POST" });
      if (url) {
        window.location.href = url;
        return;
      }
      setError("Couldn't start checkout. Please try again.");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "ALREADY_PAID") {
        setError("You already have full access — create unlimited games anytime.");
      } else {
        setError("Couldn't start checkout. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "…" : children}
      </button>
      {error && (
        <span className="mt-2 block text-sm text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </>
  );
}
