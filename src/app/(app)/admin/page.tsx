"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  isPaid: boolean;
  isAdmin: boolean;
  createdAt: string;
  _count: { organizations: number };
}

export default function AdminPage() {
  const { appUser, loading: authLoading } = useAuth();
  const { apiFetch } = useApi();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!appUser?.isAdmin) {
      router.replace("/dashboard");
      return;
    }
    apiFetch("/api/admin/users")
      .then(setUsers)
      .catch(() => router.replace("/dashboard"))
      .finally(() => setLoading(false));
  }, [authLoading, appUser, apiFetch, router]);

  const togglePaid = async (userId: string, currentPaid: boolean) => {
    setToggling(userId);
    try {
      const updated = await apiFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ isPaid: !currentPaid }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isPaid: updated.isPaid } : u))
      );
    } catch {
      // handle
    } finally {
      setToggling(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } catch {
      // handle
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!appUser?.isAdmin) return null;

  const paidCount = users.filter((u) => u.isPaid).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin - Users</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {users.length} total | {paidCount} paid
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase dark:border-gray-700">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Signed Up</th>
                <th className="pb-2 pr-4">Teams</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2 pr-4 font-medium">
                    {u.displayName || "-"}
                    {u.isAdmin && (
                      <span className="ml-1 text-xs text-blue-500">(admin)</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
                    {u.email}
                  </td>
                  <td className="py-2 pr-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4 text-gray-500">
                    {u._count.organizations}
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePaid(u.id, u.isPaid)}
                        disabled={toggling === u.id}
                        className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                          u.isPaid
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        {toggling === u.id ? "..." : u.isPaid ? "Mark Paid" : "Not Paid"}
                      </button>
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="rounded px-3 py-1 text-xs font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will permanently delete <strong>{deletingUser?.displayName || deletingUser?.email}</strong> and all their data (organizations, teams, games, and stats).
          </p>
          <p className="text-sm font-medium text-red-600">This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
