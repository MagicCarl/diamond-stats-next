"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stats/search", label: "Stats Search" },
  { href: "/instructions", label: "Instructions" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              My Baseball Stats
            </Link>
            <div className="hidden gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith(link.href)
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <button
                onClick={logout}
                className="hidden rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:block"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                pathname.startsWith(link.href)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 dark:text-gray-400"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
