"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { BattingStats } from "@/lib/stats";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

interface PlayerStat {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    jerseyNumber: number | null;
  };
  stats: BattingStats;
}

interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
  games: number;
}

export default function TeamStatsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [record, setRecord] = useState<TeamRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof BattingStats>("avg");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    apiFetch(`/api/teams/${teamId}/stats`)
      .then((data) => {
        setPlayerStats(data.playerStats);
        setRecord(data.record);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, teamId]);

  const handleSort = (col: keyof BattingStats) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  const sorted = [...playerStats].sort((a, b) => {
    const aVal = a.stats[sortBy];
    const bVal = b.stats[sortBy];
    const aNum = typeof aVal === "string" ? parseFloat(aVal) || 0 : aVal;
    const bNum = typeof bVal === "string" ? parseFloat(bVal) || 0 : bVal;
    return sortAsc ? aNum - bNum : bNum - aNum;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const SortHeader = ({ col, label }: { col: keyof BattingStats; label: string }) => (
    <th
      className="cursor-pointer px-2 py-1 text-center font-medium hover:text-blue-600"
      onClick={() => handleSort(col)}
    >
      {label}
      {sortBy === col && (sortAsc ? " \u25B2" : " \u25BC")}
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/teams/${teamId}`}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            &larr; Back to Team
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Season Stats</h1>
        </div>
        <Link href={`/teams/${teamId}/spray-chart`}>
          <button className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium dark:bg-gray-700">
            Spray Chart
          </button>
        </Link>
      </div>

      {/* Team Record */}
      {record && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Wins", value: record.wins, color: "text-green-600" },
            { label: "Losses", value: record.losses, color: "text-red-600" },
            { label: "Ties", value: record.ties, color: "text-yellow-600" },
            {
              label: "Win %",
              value:
                record.wins + record.losses > 0
                  ? ((record.wins / (record.wins + record.losses)) * 100).toFixed(0) + "%"
                  : "-",
              color: "",
            },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Batting Stats Table */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          Batting
        </h3>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400">No stats yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                  <th className="px-2 py-1 font-medium">Player</th>
                  <SortHeader col="games" label="G" />
                  <SortHeader col="atBats" label="AB" />
                  <SortHeader col="hits" label="H" />
                  <SortHeader col="doubles" label="2B" />
                  <SortHeader col="triples" label="3B" />
                  <SortHeader col="homeRuns" label="HR" />
                  <SortHeader col="rbi" label="RBI" />
                  <SortHeader col="walks" label="BB" />
                  <SortHeader col="strikeouts" label="K" />
                  <SortHeader col="stolenBases" label="SB" />
                  <SortHeader col="avg" label="AVG" />
                  <SortHeader col="obp" label="OBP" />
                  <SortHeader col="slg" label="SLG" />
                  <SortHeader col="ops" label="OPS" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((ps) => (
                  <tr
                    key={ps.player.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="whitespace-nowrap px-2 py-1 font-medium">
                      #{ps.player.jerseyNumber ?? "-"} {ps.player.firstName}{" "}
                      {ps.player.lastName}
                    </td>
                    <td className="px-2 py-1 text-center">{ps.stats.games}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.atBats}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.hits}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.doubles}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.triples}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.homeRuns}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.rbi}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.walks}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.strikeouts}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.stolenBases}</td>
                    <td className="px-2 py-1 text-center font-semibold">
                      {ps.stats.avg}
                    </td>
                    <td className="px-2 py-1 text-center">{ps.stats.obp}</td>
                    <td className="px-2 py-1 text-center">{ps.stats.slg}</td>
                    <td className="px-2 py-1 text-center font-semibold">
                      {ps.stats.ops}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
