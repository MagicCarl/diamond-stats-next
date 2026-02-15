"use client";

import { useAuth } from "@/providers/AuthProvider";
import Card from "@/components/ui/Card";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Profile
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span>{user?.displayName || "-"}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <ThemeToggle />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Subscription
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Diamond Stats Annual</p>
            <p className="text-sm text-gray-500">$29.99/year &middot; All features included</p>
          </div>
          <a
            href="https://www.paypal.com/paypalme/carlrandrews"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Subscribe
          </a>
        </div>
        <ul className="mt-3 space-y-1 text-xs text-gray-500">
          <li>Unlimited teams &amp; seasons</li>
          <li>Live scoring with pitch tracking</li>
          <li>Spray charts &amp; advanced stats</li>
          <li>Opponent batter tracking &amp; splits</li>
        </ul>
      </Card>
    </div>
  );
}
