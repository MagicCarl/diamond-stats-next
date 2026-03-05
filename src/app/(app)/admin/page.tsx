"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { clsx } from "clsx";
import Spinner from "@/components/ui/Spinner";
import UsersTab from "@/components/admin/UsersTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";

const TABS = [
  { id: "users", label: "Users" },
  { id: "analytics", label: "Analytics" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const { appUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("users");

  useEffect(() => {
    if (authLoading) return;
    if (!appUser?.isAdmin) {
      router.replace("/dashboard");
    }
  }, [authLoading, appUser, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!appUser?.isAdmin) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="mt-4 flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "users" && <UsersTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  );
}
