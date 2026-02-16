"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { RESULT_LABELS, AT_BAT_RESULTS } from "@/lib/constants";

interface PlayerBoxLine {
  name: string;
  ab: number;
  hits: number;
  runs: number;
  rbi: number;
  bb: number;
  k: number;
  sb: number;
  avg: string;
}

export default function BoxScorePage() {
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

  // Calculate box score lines per player
  const playerMap = new Map<string, PlayerBoxLine>();

  for (const entry of game.lineupEntries) {
    const p = entry.player;
    playerMap.set(p.id, {
      name: `${p.firstName} ${p.lastName}`,
      ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, k: 0, sb: 0, avg: ".000",
    });
  }

  for (const ab of game.atBats) {
    const line = playerMap.get(ab.playerId);
    if (!line) continue;

    const isHit = (AT_BAT_RESULTS.hits as readonly string[]).includes(ab.result);
    const isWalk = ab.result === "walk" || ab.result === "hbp" || ab.result === "ibb";
    const isK = ab.result === "strikeout_swinging" || ab.result === "strikeout_looking";
    const isSac = ab.result === "sacrifice_fly" || ab.result === "sacrifice_bunt";

    if (!isWalk && !isSac) line.ab++;
    if (isHit) line.hits++;
    if (ab.runnerScored) line.runs++;
    line.rbi += ab.rbi;
    if (isWalk) line.bb++;
    if (isK) line.k++;
    line.sb += ab.stolenBases;

    line.avg = line.ab > 0
      ? (line.hits / line.ab).toFixed(3).replace(/^0/, "")
      : ".000";
  }

  const boxLines = Array.from(playerMap.values());

  // Build inning-by-inning scoreboard
  const innings = game.inningsCount || 6;
  const ourRunsByInning: number[] = Array(innings).fill(0);
  const oppRunsByInning: number[] = Array(innings).fill(0);
  let ourHits = 0;
  let oppHits = 0;
  let ourErrors = 0;
  let oppErrors = 0;

  for (const ab of game.atBats) {
    const inningIdx = Math.min(ab.inning - 1, innings - 1);
    const isOurBatting = !!ab.playerId;
    const isHit = (AT_BAT_RESULTS.hits as readonly string[]).includes(ab.result);
    const isError = ab.result === "error";

    if (isOurBatting) {
      if (ab.runnerScored) ourRunsByInning[inningIdx]++;
      if (isHit) ourHits++;
      if (isError) oppErrors++;
    } else {
      if (ab.runnerScored) oppRunsByInning[inningIdx]++;
      if (isHit) oppHits++;
      if (isError) ourErrors++;
    }
  }

  // Team display names
  const oppTeamName = game.opponentName;

  // Top row = away team, bottom row = home team
  const topName = game.isHome ? oppTeamName : "Us";
  const botName = game.isHome ? "Us" : oppTeamName;
  const topRuns = game.isHome ? oppRunsByInning : ourRunsByInning;
  const botRuns = game.isHome ? ourRunsByInning : oppRunsByInning;
  const topR = game.isHome ? game.opponentScore : game.ourScore;
  const botR = game.isHome ? game.ourScore : game.opponentScore;
  const topH = game.isHome ? oppHits : ourHits;
  const botH = game.isHome ? ourHits : oppHits;
  const topE = game.isHome ? oppErrors : ourErrors;
  const botE = game.isHome ? ourErrors : oppErrors;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href={`/games/${gameId}/live`}
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        &larr; Back to Game
      </Link>

      {/* Inning-by-inning scoreboard */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-2 py-1.5 text-left font-medium"></th>
                {Array.from({ length: innings }, (_, i) => (
                  <th
                    key={i}
                    className={`min-w-[28px] px-1.5 py-1.5 text-center font-medium ${
                      game.currentInning === i + 1 && game.status !== "final"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </th>
                ))}
                <th className="min-w-[32px] border-l border-gray-300 px-2 py-1.5 text-center font-semibold dark:border-gray-600">R</th>
                <th className="min-w-[32px] px-2 py-1.5 text-center font-semibold">H</th>
                <th className="min-w-[32px] px-2 py-1.5 text-center font-semibold">E</th>
              </tr>
            </thead>
            <tbody>
              {/* Away team (top of inning) */}
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">{topName}</td>
                {topRuns.map((r, i) => {
                  const played = game.status === "final" || game.currentInning > i + 1 || (game.currentInning === i + 1 && !game.isTopOfInning);
                  return (
                    <td
                      key={i}
                      className={`px-1.5 py-1.5 text-center ${
                        game.currentInning === i + 1 && game.status !== "final" ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      {played ? r : "\u2014"}
                    </td>
                  );
                })}
                <td className="border-l border-gray-300 px-2 py-1.5 text-center font-bold dark:border-gray-600">{topR}</td>
                <td className="px-2 py-1.5 text-center">{topH}</td>
                <td className="px-2 py-1.5 text-center">{topE}</td>
              </tr>
              {/* Home team (bottom of inning) */}
              <tr>
                <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-blue-500">{botName}</td>
                {botRuns.map((r, i) => {
                  const played = game.status === "final" || game.currentInning > i + 1 || (game.currentInning === i + 1 && game.isTopOfInning === false);
                  return (
                    <td
                      key={i}
                      className={`px-1.5 py-1.5 text-center ${
                        game.currentInning === i + 1 && game.status !== "final" ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      {played ? r : "\u2014"}
                    </td>
                  );
                })}
                <td className="border-l border-gray-300 px-2 py-1.5 text-center font-bold dark:border-gray-600">{botR}</td>
                <td className="px-2 py-1.5 text-center">{botH}</td>
                <td className="px-2 py-1.5 text-center">{botE}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">
          {game.status === "final"
            ? "Final"
            : `In Progress \u2014 ${game.isTopOfInning ? "Top" : "Bot"} ${game.currentInning}`}
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Batting
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                <th className="px-2 py-1 font-medium">Player</th>
                <th className="px-2 py-1 text-center font-medium">AB</th>
                <th className="px-2 py-1 text-center font-medium">H</th>
                <th className="px-2 py-1 text-center font-medium">R</th>
                <th className="px-2 py-1 text-center font-medium">RBI</th>
                <th className="px-2 py-1 text-center font-medium">BB</th>
                <th className="px-2 py-1 text-center font-medium">K</th>
                <th className="px-2 py-1 text-center font-medium">SB</th>
                <th className="px-2 py-1 text-center font-medium">AVG</th>
              </tr>
            </thead>
            <tbody>
              {boxLines.map((line, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-2 py-1 font-medium">{line.name}</td>
                  <td className="px-2 py-1 text-center">{line.ab}</td>
                  <td className="px-2 py-1 text-center">{line.hits}</td>
                  <td className="px-2 py-1 text-center">{line.runs}</td>
                  <td className="px-2 py-1 text-center">{line.rbi}</td>
                  <td className="px-2 py-1 text-center">{line.bb}</td>
                  <td className="px-2 py-1 text-center">{line.k}</td>
                  <td className="px-2 py-1 text-center">{line.sb}</td>
                  <td className="px-2 py-1 text-center">{line.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Play-by-play */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Play-by-Play
        </h3>
        <div className="space-y-1">
          {game.atBats.map((ab: { id: string; player?: { firstName: string; lastName: string }; opponentBatter?: { name: string }; result: string; rbi: number; stolenBases: number; isTop: boolean; inning: number }) => {
            const batterName = ab.player
              ? `${ab.player.firstName} ${ab.player.lastName}`
              : ab.opponentBatter?.name || "Unknown";
            return (
              <div
                key={ab.id}
                className="flex items-center justify-between rounded px-2 py-1 text-sm odd:bg-gray-50 dark:odd:bg-gray-800/50"
              >
                <span>
                  <span className="font-medium">
                    {batterName}
                  </span>
                  {" - "}
                  {RESULT_LABELS[ab.result] || ab.result}
                  {ab.rbi > 0 && ` (${ab.rbi} RBI)`}
                  {ab.stolenBases > 0 && ` (${ab.stolenBases} SB)`}
                </span>
                <span className="text-xs text-gray-400">
                  {ab.isTop ? "T" : "B"}{ab.inning}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
