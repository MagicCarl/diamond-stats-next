"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Team, Season } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";

export default function NewGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const { apiFetch } = useApi();

  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [form, setForm] = useState({
    teamId: teamId || "",
    seasonId: "",
    opponentName: "",
    gameDate: new Date().toISOString().split("T")[0],
    gameTime: "",
    location: "",
    isHome: true,
    inningsCount: 6,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/teams").then(setTeams).catch(() => {});
  }, [apiFetch]);

  useEffect(() => {
    if (form.teamId) {
      apiFetch(`/api/seasons?teamId=${form.teamId}`)
        .then(setSeasons)
        .catch(() => {});
    }
  }, [form.teamId, apiFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const game = await apiFetch("/api/games", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push(`/games/${game.id}/live`);
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">New Game</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!teamId && (
            <Select
              id="teamId"
              label="Team"
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              options={[
                { value: "", label: "Select team..." },
                ...teams.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
          )}

          {seasons.length > 0 && (
            <Select
              id="seasonId"
              label="Season"
              value={form.seasonId}
              onChange={(e) => setForm({ ...form, seasonId: e.target.value })}
              options={[
                { value: "", label: "No season" },
                ...seasons.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}

          <Input
            id="opponentName"
            label="Opponent"
            value={form.opponentName}
            onChange={(e) => setForm({ ...form, opponentName: e.target.value })}
            placeholder="e.g., Eastside Eagles"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="gameDate"
              label="Date"
              type="date"
              value={form.gameDate}
              onChange={(e) => setForm({ ...form, gameDate: e.target.value })}
              required
            />
            <Input
              id="gameTime"
              label="Time"
              type="time"
              value={form.gameTime}
              onChange={(e) => setForm({ ...form, gameTime: e.target.value })}
            />
          </div>

          <Input
            id="location"
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g., Wilson Park Field 3"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="isHome"
              label="Home/Away"
              value={form.isHome ? "home" : "away"}
              onChange={(e) =>
                setForm({ ...form, isHome: e.target.value === "home" })
              }
              options={[
                { value: "home", label: "Home" },
                { value: "away", label: "Away" },
              ]}
            />
            <Input
              id="innings"
              label="Innings"
              type="number"
              min={1}
              max={12}
              value={form.inningsCount}
              onChange={(e) =>
                setForm({ ...form, inningsCount: parseInt(e.target.value) || 6 })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.teamId}>
              {saving ? "Creating..." : "Start Game"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
