"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import SprayChartDiamond from "@/components/spray-chart/SprayChartDiamond";
import { RESULT_COLORS } from "@/lib/constants";
import { Player } from "@/types";

interface HitData {
  x: number;
  y: number;
  result: string;
  playerId: string;
  playerName: string;
}

export default function TeamSprayChartPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const t = useTranslations("teams.sprayChart");
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
            // Only our hitters — opponent batters' balls in play don't belong
            // on this team's spray charts.
            if (ab.player && ab.hitLocationX != null && ab.hitLocationY != null) {
              allHits.push({
                x: ab.hitLocationX,
                y: ab.hitLocationY,
                result: ab.result,
                playerId: ab.player.id,
                playerName: `${ab.player.firstName} ${ab.player.lastName}`,
              });
            }
          }
        }
        setHits(allHits);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, teamId]);

  const hitsByPlayer = new Map<string, HitData[]>();
  for (const hit of hits) {
    hitsByPlayer.set(hit.playerId, [...(hitsByPlayer.get(hit.playerId) ?? []), hit]);
  }
  const playersWithHits = players.filter((p) => hitsByPlayer.has(p.id));
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);
  const filteredHits = selectedPlayer ? hitsByPlayer.get(selectedPlayer.id) ?? [] : hits;

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
    { result: "groundout", label: t("out") },
  ];

  const legend = (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
      {legendItems.map((item) => (
        <div key={item.result} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: RESULT_COLORS[item.result] }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const chipClass = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm transition-colors ${
      active
        ? "border-blue-600 bg-blue-600 font-medium text-white"
        : "border-black/10 bg-white text-gray-700 hover:border-blue-300 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500/50"
    }`;

  const playerLabel = (p: Player) => `#${p.jerseyNumber ?? "-"} ${p.firstName} ${p.lastName}`;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/teams/${teamId}/stats`}
          className="text-sm text-gray-500 hover:text-gray-700 lg:hidden dark:text-gray-400"
        >
          &larr; {t("backToStats")}
        </Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedPlayerId("all")} className={chipClass(!selectedPlayer)}>
          {t("allPlayers")}
        </button>
        {playersWithHits.map((p) => (
          <button key={p.id} onClick={() => setSelectedPlayerId(p.id)} className={chipClass(selectedPlayerId === p.id)}>
            {playerLabel(p)}
          </button>
        ))}
      </div>

      {hits.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t("noHits")}</p>
        </Card>
      ) : (
        <>
          <Card className="mx-auto max-w-xl">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="font-semibold">{selectedPlayer ? playerLabel(selectedPlayer) : t("allPlayers")}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("ballsInPlay", { count: filteredHits.length })}
              </span>
            </div>
            <SprayChartDiamond hits={filteredHits} size={360} />
            <div className="mt-4">{legend}</div>
          </Card>

          {!selectedPlayer && playersWithHits.length > 1 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {playersWithHits.map((p) => {
                const playerHits = hitsByPlayer.get(p.id) ?? [];
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlayerId(p.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-2xl border border-black/[0.07] bg-white p-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-gray-900 dark:hover:border-blue-500/50"
                  >
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{playerLabel(p)}</span>
                      <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        {t("ballsInPlay", { count: playerHits.length })}
                      </span>
                    </div>
                    <SprayChartDiamond hits={playerHits} size={240} />
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
