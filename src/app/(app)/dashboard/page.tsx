"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Team } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { LEVELS } from "@/lib/constants";

export default function DashboardPage() {
  const { apiFetch } = useApi();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [modalView, setModalView] = useState<"pick" | "create">("pick");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLevel, setNewTeamLevel] = useState("little_league");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      const data = await apiFetch("/api/teams");
      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    setError(null);

    try {
      await apiFetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          name: newTeamName,
          level: newTeamLevel,
        }),
      });
      setNewTeamName("");
      setShowTeamModal(false);
      await fetchTeams();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create team";
      setError(message);
      console.error("Create team error:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Teams</h1>
        <Button onClick={() => { setShowTeamModal(true); setModalView(teams.length > 0 ? "pick" : "create"); setError(null); }}>+ New Team</Button>
      </div>

      {teams.length === 0 ? (
        <Card className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No teams yet. Create your first team to get started.
          </p>
          <Button className="mt-4" onClick={() => { setShowTeamModal(true); setModalView("create"); setError(null); }}>
            Create Team
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {LEVELS.find((l) => l.value === team.level)?.label || team.level}
                </p>
                <div className="mt-3 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{team._count?.players || 0} players</span>
                  <span>{team._count?.games || 0} games</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title={modalView === "pick" ? "Select a Team" : "Create New Team"}
      >
        {modalView === "pick" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose an existing team or create a new one.
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setShowTeamModal(false);
                    router.push(`/teams/${team.id}`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {LEVELS.find((l) => l.value === team.level)?.label || team.level}
                      {" · "}
                      {team._count?.players || 0} players
                    </p>
                  </div>
                  <span className="text-gray-400">&rarr;</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <Button
                className="w-full"
                onClick={() => setModalView("create")}
              >
                + Create New Team
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
            <Input
              id="teamName"
              label="Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="e.g., Westside Tigers"
              required
            />
            <Select
              id="teamLevel"
              label="Level"
              value={newTeamLevel}
              onChange={(e) => setNewTeamLevel(e.target.value)}
              options={LEVELS.map((l) => ({ value: l.value, label: l.label }))}
            />
            <div className="flex justify-end gap-3">
              {teams.length > 0 && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setModalView("pick")}
                >
                  Back
                </Button>
              )}
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowTeamModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
