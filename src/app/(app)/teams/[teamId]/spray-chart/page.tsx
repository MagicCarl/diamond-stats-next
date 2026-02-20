"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import SprayChartDiamond from "@/components/spray-chart/SprayChartDiamond";
import { RESULT_COLORS, RESULT_LABELS } from "@/lib/constants";
import { Player } from "@/types";

interface HitData {
  x: number;
  y: number;
  result: string;
  playerName: string;
}

export default function TeamSprayChartPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const [hits, setHits] = useState<HitData[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/teams/${teamId}`)
      .then((team) => {
        setPlayers(team.players);
        // Fetch all games with at-bats included
        return apiFetch(`/api/games?teamId=${teamId}`);
      })
      .then(async (games) => {
        // Fetch all game details in parallel instead of sequentially
        const gameDetails = await Promise.all(
          games.map((game: { id: string }) => apiFetch(`/api/games/${game.id}`))
        );
        const allHits: HitData[] = [];
        for (const gameDetail of gameDetails) {
          for (const ab of gameDetail.atBats) {
            if (ab.hitLocationX != null && ab.hitLocationY != null) {
              allHits.push({
                x: ab.hitLocationX,
                y: ab.hitLocationY,
                result: ab.result,
                playerName: ab.player
                  ? `${ab.player.firstName} ${ab.player.lastName}`
                  : ab.opponentBatter?.name || "Unknown",
              });
            }
          }
        }
        setHits(allHits);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, teamId]);

  const filteredHits =
    selectedPlayerId === "all"
      ? hits
      : hits.filter((h) => {
          const player = players.find((p) => p.id === selectedPlayerId);
          return player && h.playerName === `${player.firstName} ${player.lastName}`;
        });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const legendItems = [
    { result: "single", label: "1B" },
    { result: "double", label: "2B" },
    { result: "triple", label: "3B" },
    { result: "home_run", label: "HR" },
    { result: "groundout", label: "Out" },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Link
        href={`/teams/${teamId}/stats`}
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        &larr; Back to Stats
      </Link>
      <h1 className="text-2xl font-bold">Season Spray Chart</h1>

      <Card>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Player
          </label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="all">All Players</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.jerseyNumber ?? "-"} {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <SprayChartDiamond hits={filteredHits} size={320} />

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {legendItems.map((item) => (
            <div key={item.result} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: RESULT_COLORS[item.result] }}
              />
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-sm text-gray-400">
          {filteredHits.length} hit{filteredHits.length !== 1 ? "s" : ""} recorded
        </p>
      </Card>
    </div>
  );
}
