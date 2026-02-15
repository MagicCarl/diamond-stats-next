"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { Team } from "@/types";
import { BattingStats } from "@/lib/stats";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface PlayerStat {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    jerseyNumber: number | null;
  };
  stats: BattingStats;
}

export default function StatsSearchPage() {
  const { apiFetch } = useApi();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [vsTeam, setVsTeam] = useState("");
  const [vsPitcher, setVsPitcher] = useState("");
  const [vsHand, setVsHand] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState<PlayerStat[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/api/teams").then(setTeams).catch(() => {});
  }, [apiFetch]);

  const handleSearch = async () => {
    if (!selectedTeamId) return;
    setLoading(true);
    setSearched(true);

    const params = new URLSearchParams();
    if (vsTeam) params.set("vs_team", vsTeam);
    if (vsPitcher) params.set("vs_pitcher", vsPitcher);
    if (vsHand) params.set("vs_hand", vsHand);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    try {
      const data = await apiFetch(
        `/api/teams/${selectedTeamId}/stats?${params.toString()}`
      );
      setResults(data.playerStats);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Stats Search</h1>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            id="team"
            label="Team"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            options={[
              { value: "", label: "Select team..." },
              ...teams.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
          <Input
            id="vsTeam"
            label="vs. Opponent"
            value={vsTeam}
            onChange={(e) => setVsTeam(e.target.value)}
            placeholder="e.g., Eagles"
          />
          <Input
            id="vsPitcher"
            label="vs. Pitcher"
            value={vsPitcher}
            onChange={(e) => setVsPitcher(e.target.value)}
            placeholder="e.g., Smith"
          />
          <Select
            id="vsHand"
            label="Pitcher Throws"
            value={vsHand}
            onChange={(e) => setVsHand(e.target.value)}
            options={[
              { value: "", label: "Any" },
              { value: "right", label: "Right" },
              { value: "left", label: "Left" },
            ]}
          />
          <Input
            id="fromDate"
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            id="toDate"
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleSearch} disabled={!selectedTeamId || loading}>
            {loading ? "Searching..." : "Search Stats"}
          </Button>
        </div>
      </Card>

      {searched && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
            Results
            {vsTeam && ` (vs ${vsTeam})`}
            {vsPitcher && ` (pitcher: ${vsPitcher})`}
            {vsHand && ` (${vsHand === "left" ? "LHP" : "RHP"})`}
          </h3>
          {results.length === 0 ? (
            <p className="text-sm text-gray-400">
              No stats found for these filters
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                    <th className="px-2 py-1 font-medium">Player</th>
                    <th className="px-2 py-1 text-center font-medium">G</th>
                    <th className="px-2 py-1 text-center font-medium">AB</th>
                    <th className="px-2 py-1 text-center font-medium">H</th>
                    <th className="px-2 py-1 text-center font-medium">HR</th>
                    <th className="px-2 py-1 text-center font-medium">RBI</th>
                    <th className="px-2 py-1 text-center font-medium">BB</th>
                    <th className="px-2 py-1 text-center font-medium">K</th>
                    <th className="px-2 py-1 text-center font-medium">SB</th>
                    <th className="px-2 py-1 text-center font-medium">AVG</th>
                    <th className="px-2 py-1 text-center font-medium">OBP</th>
                    <th className="px-2 py-1 text-center font-medium">OPS</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((ps) => (
                    <tr
                      key={ps.player.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="whitespace-nowrap px-2 py-1 font-medium">
                        {ps.player.firstName} {ps.player.lastName}
                      </td>
                      <td className="px-2 py-1 text-center">{ps.stats.games}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.atBats}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.hits}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.homeRuns}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.rbi}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.walks}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.strikeouts}</td>
                      <td className="px-2 py-1 text-center">{ps.stats.stolenBases}</td>
                      <td className="px-2 py-1 text-center font-semibold">
                        {ps.stats.avg}
                      </td>
                      <td className="px-2 py-1 text-center">{ps.stats.obp}</td>
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
      )}
    </div>
  );
}
