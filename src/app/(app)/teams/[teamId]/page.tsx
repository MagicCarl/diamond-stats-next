"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Player, Game } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { POSITIONS } from "@/lib/constants";

interface Season {
  id: string;
  name: string;
  createdAt: string;
}

interface TeamDetail {
  id: string;
  name: string;
  level: string;
  players: Player[];
  games: Game[];
  seasons: Season[];
  _count: { players: number; games: number };
}

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerForm, setPlayerForm] = useState({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    bats: "right",
    throwsHand: "right",
    primaryPosition: "",
  });
  const [saving, setSaving] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    bats: "right",
    throwsHand: "right",
    primaryPosition: "",
  });
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const [seasonName, setSeasonName] = useState("");
  const [showDeleteGames, setShowDeleteGames] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = async () => {
    try {
      const data = await apiFetch(`/api/teams/${teamId}`);
      setTeam(data);
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/api/teams/${teamId}/players`, {
        method: "POST",
        body: JSON.stringify({
          ...playerForm,
          jerseyNumber: playerForm.jerseyNumber
            ? parseInt(playerForm.jerseyNumber)
            : null,
        }),
      });
      setPlayerForm({
        firstName: "",
        lastName: "",
        jerseyNumber: "",
        bats: "right",
        throwsHand: "right",
        primaryPosition: "",
      });
      setShowAddPlayer(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonName.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/api/seasons", {
        method: "POST",
        body: JSON.stringify({ teamId, name: seasonName.trim() }),
      });
      setSeasonName("");
      setShowCreateSeason(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setEditForm({
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNumber: player.jerseyNumber?.toString() ?? "",
      bats: player.bats,
      throwsHand: player.throwsHand,
      primaryPosition: player.primaryPosition || "",
    });
  };

  const handleEditPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    setSaving(true);
    try {
      await apiFetch(`/api/teams/${teamId}/players/${editingPlayer.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editForm,
          jerseyNumber: editForm.jerseyNumber
            ? parseInt(editForm.jerseyNumber)
            : null,
        }),
      });
      setEditingPlayer(null);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    try {
      await apiFetch(`/api/teams/${teamId}/players/${playerId}`, {
        method: "DELETE",
      });
      fetchTeam();
    } catch {
      // handle
    }
  };

  const handleDeleteAllGames = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/teams/${teamId}/games`, {
        method: "DELETE",
      });
      setShowDeleteGames(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    try {
      await apiFetch(`/api/seasons/${seasonId}`, { method: "DELETE" });
      fetchTeam();
    } catch {
      // handle
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!team) {
    return <p className="py-10 text-center text-gray-500">Team not found</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{team.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowCreateSeason(true)}>
            + Season
          </Button>
          <Link href={`/teams/${teamId}/stats`}>
            <Button variant="secondary" size="sm">
              Season Stats
            </Button>
          </Link>
          <Link href={`/games/new?teamId=${teamId}`}>
            <Button size="sm">+ New Game</Button>
          </Link>
        </div>
      </div>

      {/* Roster */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Roster ({team.players.length})
          </h2>
          <Button size="sm" variant="secondary" onClick={() => setShowAddPlayer(true)}>
            + Add Player
          </Button>
        </div>

        {team.players.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              No players yet. Add players to your roster to get started.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Pos</th>
                  <th className="px-3 py-2 font-medium">Bats</th>
                  <th className="px-3 py-2 font-medium">Throws</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {team.players.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-3 py-2 text-gray-500">
                      {player.jerseyNumber ?? "-"}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {player.firstName} {player.lastName}
                    </td>
                    <td className="px-3 py-2">
                      {player.primaryPosition || "-"}
                    </td>
                    <td className="px-3 py-2 capitalize">{player.bats}</td>
                    <td className="px-3 py-2 capitalize">{player.throwsHand}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(player)}
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Seasons */}
      {team.seasons.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Seasons</h2>
          <div className="space-y-2">
            {team.seasons.map((season) => (
              <Card key={season.id} className="flex items-center justify-between">
                <span className="font-medium">{season.name}</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete season "${season.name}"? Games in this season will be preserved but no longer assigned to it.`)) {
                      handleDeleteSeason(season.id);
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Games */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Recent Games ({team._count?.games ?? team.games.length})
        </h2>

        {team.games.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              No games yet. Start a new game to begin tracking stats.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {team.games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}/live`}>
                <Card className="flex cursor-pointer items-center justify-between transition-shadow hover:shadow-md">
                  <div>
                    <p className="font-medium">
                      {game.isHome ? "vs" : "@"} {game.opponentName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(game.gameDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {game.ourScore} - {game.opponentScore}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        game.status === "final"
                          ? "text-green-600"
                          : game.status === "in_progress"
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {game.status === "final"
                        ? "Final"
                        : game.status === "in_progress"
                        ? `In Progress - ${game.isTopOfInning ? "Top" : "Bot"} ${game.currentInning}`
                        : "Scheduled"}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {team.games.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              onClick={() => setShowDeleteGames(true)}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-center font-medium text-white hover:bg-red-700"
            >
              Delete All Games ({team._count?.games ?? team.games.length})
            </button>
          </div>
        )}
      </section>

      {/* Add Player Modal */}
      <Modal
        isOpen={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        title="Add Player"
      >
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First Name"
              value={playerForm.firstName}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, firstName: e.target.value })
              }
              required
            />
            <Input
              id="lastName"
              label="Last Name"
              value={playerForm.lastName}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="jerseyNumber"
              label="Jersey #"
              type="number"
              value={playerForm.jerseyNumber}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, jerseyNumber: e.target.value })
              }
            />
            <Select
              id="bats"
              label="Bats"
              value={playerForm.bats}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, bats: e.target.value })
              }
              options={[
                { value: "right", label: "Right" },
                { value: "left", label: "Left" },
                { value: "switch", label: "Switch" },
              ]}
            />
            <Select
              id="throws"
              label="Throws"
              value={playerForm.throwsHand}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, throwsHand: e.target.value })
              }
              options={[
                { value: "right", label: "Right" },
                { value: "left", label: "Left" },
              ]}
            />
          </div>
          <Select
            id="position"
            label="Primary Position"
            value={playerForm.primaryPosition}
            onChange={(e) =>
              setPlayerForm({ ...playerForm, primaryPosition: e.target.value })
            }
            options={[
              { value: "", label: "Select..." },
              ...POSITIONS.map((p) => ({ value: p, label: p })),
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowAddPlayer(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add Player"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Season Modal */}
      <Modal
        isOpen={showCreateSeason}
        onClose={() => setShowCreateSeason(false)}
        title="Create Season"
      >
        <form onSubmit={handleCreateSeason} className="space-y-4">
          <Input
            id="seasonName"
            label="Season Name"
            placeholder="e.g. Spring 2026"
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowCreateSeason(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Season"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete All Games Confirmation */}
      <Modal
        isOpen={showDeleteGames}
        onClose={() => setShowDeleteGames(false)}
        title="Delete All Games"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will permanently delete all {team._count?.games ?? team.games.length} game(s) and their stats for <strong>{team.name}</strong>. Your team roster will be preserved.
          </p>
          <p className="text-sm font-medium text-red-600">This cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteGames(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAllGames} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete All Games"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Player Modal */}
      <Modal
        isOpen={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        title="Edit Player"
      >
        <form onSubmit={handleEditPlayer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="editFirstName"
              label="First Name"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              required
            />
            <Input
              id="editLastName"
              label="Last Name"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="editJerseyNumber"
              label="Jersey #"
              type="number"
              value={editForm.jerseyNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, jerseyNumber: e.target.value })
              }
            />
            <Select
              id="editBats"
              label="Bats"
              value={editForm.bats}
              onChange={(e) =>
                setEditForm({ ...editForm, bats: e.target.value })
              }
              options={[
                { value: "right", label: "Right" },
                { value: "left", label: "Left" },
                { value: "switch", label: "Switch" },
              ]}
            />
            <Select
              id="editThrows"
              label="Throws"
              value={editForm.throwsHand}
              onChange={(e) =>
                setEditForm({ ...editForm, throwsHand: e.target.value })
              }
              options={[
                { value: "right", label: "Right" },
                { value: "left", label: "Left" },
              ]}
            />
          </div>
          <Select
            id="editPosition"
            label="Primary Position"
            value={editForm.primaryPosition}
            onChange={(e) =>
              setEditForm({ ...editForm, primaryPosition: e.target.value })
            }
            options={[
              { value: "", label: "Select..." },
              ...POSITIONS.map((p) => ({ value: p, label: p })),
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingPlayer(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
