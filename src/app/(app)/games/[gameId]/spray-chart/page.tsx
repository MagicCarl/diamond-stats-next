"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import SprayChartDiamond from "@/components/spray-chart/SprayChartDiamond";
import { RESULT_COLORS } from "@/lib/constants";

export default function GameSprayChartPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { apiFetch } = useApi();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/games/${gameId}`)
      .then(setGame)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, gameId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!game) {
    return <p className="py-10 text-center text-gray-500">Game not found</p>;
  }

  const hits = game.atBats
    .filter((ab: { hitLocationX: number | null; hitLocationY: number | null }) =>
      ab.hitLocationX != null && ab.hitLocationY != null
    )
    .map((ab: { hitLocationX: number; hitLocationY: number; result: string; player: { firstName: string; lastName: string } }) => ({
      x: ab.hitLocationX,
      y: ab.hitLocationY,
      result: ab.result,
      playerName: `${ab.player.firstName} ${ab.player.lastName}`,
    }));

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
        href={`/games/${gameId}/live`}
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        &larr; Back to Game
      </Link>
      <h1 className="text-2xl font-bold">
        Game Spray Chart - vs {game.opponentName}
      </h1>

      <Card>
        <SprayChartDiamond hits={hits} size={320} />

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
          {hits.length} hit location{hits.length !== 1 ? "s" : ""} recorded
        </p>
      </Card>
    </div>
  );
}
