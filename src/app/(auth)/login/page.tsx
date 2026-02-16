"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    // Detect browsers that block Google sign-in popups
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("duckduckgo") || ua.includes("brave")) {
      setShowBrowserWarning(true);
      return;
    }

    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        setError("");
      } else if (error.code === "auth/popup-blocked") {
        setShowBrowserWarning(true);
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled. Please contact support.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setShowBrowserWarning(true);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage(
        "Password reset email sent! Check your inbox and follow the link to reset your password.",
      );
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotMessage("");
      }, 3000);
    } catch {
      setForgotMessage(
        "Error sending reset email. Make sure the email is registered.",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold">
          Sign in to My Baseball Stats
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex items-end justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        <Modal
          isOpen={showForgotPassword}
          onClose={() => {
            setShowForgotPassword(false);
            setForgotEmail("");
            setForgotMessage("");
          }}
          title="Reset Password"
        >
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
            <Input
              id="forgot-email"
              label="Email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {forgotMessage && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  forgotMessage.includes("sent")
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {forgotMessage}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                  setForgotMessage("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={forgotLoading}>
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showBrowserWarning}
          onClose={() => setShowBrowserWarning(false)}
          title="Browser Not Supported"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Google sign-in is not supported in this browser due to its privacy
              settings. Please sign in with your email and password instead, or
              try using Safari, Chrome, or Firefox.
            </p>
            <Button
              className="w-full"
              onClick={() => setShowBrowserWarning(false)}
            >
              Got it
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
