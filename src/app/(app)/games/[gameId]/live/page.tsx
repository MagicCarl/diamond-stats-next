"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { AtBatRecord, LineupEntryRecord, OpponentPitcherRecord, OpponentBatterRecord, PitchRecord, Player, Team } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { RESULT_LABELS, RESULT_FULL_NAMES, AT_BAT_RESULTS, PITCH_RESULTS, PITCH_RESULT_LABELS, PITCH_RESULT_COLORS } from "@/lib/constants";
import SprayChartDiamond from "@/components/spray-chart/SprayChartDiamond";
import StrikeZone from "@/components/pitch-chart/StrikeZone";

interface PitchingAppearanceRecord {
  id: string;
  player?: { firstName: string; lastName: string };
}

interface GameDetail {
  id: string;
  teamId: string;
  opponentName: string;
  gameDate: string;
  isHome: boolean;
  inningsCount: number;
  status: string;
  ourScore: number;
  opponentScore: number;
  currentInning: number;
  isTopOfInning: boolean;
  outsInCurrentInning: number;
  lineupEntries: (LineupEntryRecord & { player: { firstName: string; lastName: string; jerseyNumber: number | null } })[];
  atBats: AtBatRecord[];
  opponentPitchers: OpponentPitcherRecord[];
  opponentBatters: OpponentBatterRecord[];
  pitchingAppearances: PitchingAppearanceRecord[];
}

type ScoringMode = "our_batting" | "opponent_batting";

export default function LiveScoringPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { apiFetch } = useApi();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Scoring mode toggle
  const [scoringMode, setScoringMode] = useState<ScoringMode>("our_batting");

  // Our batting state
  const [currentBatterIndex, setCurrentBatterIndex] = useState(0);
  const [manualBatterIndex, setManualBatterIndex] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [rbi, setRbi] = useState(0);
  const [runnerScored, setRunnerScored] = useState(false);
  const [stolenBases, setStolenBases] = useState(0);
  const [caughtStealing, setCaughtStealing] = useState(0);
  const [hitLocation, setHitLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedPitcherId, setSelectedPitcherId] = useState<string>("");

  // Opponent batting state
  const [currentOppBatterIndex, setCurrentOppBatterIndex] = useState(0);
  const [manualOppBatterIndex, setManualOppBatterIndex] = useState<number | null>(null);
  const [oppSelectedResult, setOppSelectedResult] = useState<string | null>(null);
  const [oppRbi, setOppRbi] = useState(0);
  const [oppRunnerScored, setOppRunnerScored] = useState(false);
  const [oppHitLocation, setOppHitLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedOurPitcherId, setSelectedOurPitcherId] = useState<string>("");

  // Pitch tracking state
  const [currentPitches, setCurrentPitches] = useState<{ result: string; locationX: number | null; locationY: number | null }[]>([]);
  const [pitchLocation, setPitchLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedPitchResult, setSelectedPitchResult] = useState<string | null>(null);

  // Modals
  const [showPitcherModal, setShowPitcherModal] = useState(false);
  const [newPitcherName, setNewPitcherName] = useState("");
  const [newPitcherHand, setNewPitcherHand] = useState("right");
  const [showBatterModal, setShowBatterModal] = useState(false);
  const [newBatterName, setNewBatterName] = useState("");
  const [newBatterNumber, setNewBatterNumber] = useState("");
  const [newBatterHand, setNewBatterHand] = useState("right");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [showLineupSetup, setShowLineupSetup] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [lineupDraft, setLineupDraft] = useState<{ playerId: string; position: string }[]>([]);

  // Edit at-bat state (for adding SB/CS to previous at-bats)
  const [editingAtBatId, setEditingAtBatId] = useState<string | null>(null);
  const [editSB, setEditSB] = useState(0);
  const [editCS, setEditCS] = useState(0);

  const rosterAutoLoadedRef = useRef(false);
  const initialModeSetRef = useRef(false);
  const selectedPitcherIdRef = useRef(selectedPitcherId);
  const selectedOurPitcherIdRef = useRef(selectedOurPitcherId);
  selectedPitcherIdRef.current = selectedPitcherId;
  selectedOurPitcherIdRef.current = selectedOurPitcherId;

  const fetchGame = useCallback(async () => {
    try {
      let data = await apiFetch(`/api/games/${gameId}`);

      // Auto-load opponent roster from a matching team on the dashboard (runs once, before setting state)
      if (!rosterAutoLoadedRef.current) {
        rosterAutoLoadedRef.current = true;
        if (!data.opponentBatters || data.opponentBatters.length === 0) {
          try {
            const teams: Team[] = await apiFetch("/api/teams");
            const opponentName = data.opponentName.toLowerCase();
            const matchingTeam = teams.find(
              (t) => t.name.toLowerCase() === opponentName && t.id !== data.teamId
            );
            if (matchingTeam) {
              const players: Player[] = await apiFetch(`/api/teams/${matchingTeam.id}/players`);
              if (players.length > 0) {
                for (const player of players) {
                  await apiFetch(`/api/games/${gameId}/opponent-batters`, {
                    method: "POST",
                    body: JSON.stringify({
                      name: `${player.firstName} ${player.lastName}`,
                      jerseyNumber: player.jerseyNumber,
                      bats: player.bats,
                    }),
                  });
                }
                data = await apiFetch(`/api/games/${gameId}`);
              }
            }
          } catch {
            // Auto-load failed — user can still add batters manually
          }
        }
      }

      setGame(data);

      // Set default scoring mode on first load (home team bats last)
      if (!initialModeSetRef.current) {
        initialModeSetRef.current = true;
        if (data.atBats.length === 0) {
          setScoringMode(data.isHome ? "opponent_batting" : "our_batting");
        }
      }

      if (data.opponentPitchers.length > 0 && !selectedPitcherIdRef.current) {
        setSelectedPitcherId(data.opponentPitchers[data.opponentPitchers.length - 1].id);
      }
      // Advance our batter: cycle through lineup based on our team's at-bats
      if (data.lineupEntries.length > 0) {
        const ourAtBats = data.atBats.filter((ab: AtBatRecord) => ab.playerId);
        setCurrentBatterIndex(ourAtBats.length % data.lineupEntries.length);
      }
      // Advance opponent batter
      if (data.opponentBatters?.length > 0) {
        const oppAtBats = data.atBats.filter((ab: AtBatRecord) => ab.opponentBatterId);
        setCurrentOppBatterIndex(oppAtBats.length % data.opponentBatters.length);
      }
      // Set our pitcher if available
      if (data.pitchingAppearances?.length > 0 && !selectedOurPitcherIdRef.current) {
        setSelectedOurPitcherId(data.pitchingAppearances[data.pitchingAppearances.length - 1].id);
      }
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, [apiFetch, gameId]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Poll for updates every 3 seconds so other devices see changes in real time
  useEffect(() => {
    if (!game || game.status === "final") return;
    const interval = setInterval(() => {
      fetchGame();
    }, 3000);
    return () => clearInterval(interval);
  }, [game?.status, fetchGame]);

  // Auto-select result when pitch count reaches strikeout or walk
  useEffect(() => {
    if (currentPitches.length === 0) return;
    let balls = 0;
    let strikes = 0;
    for (const p of currentPitches) {
      if (p.result === "ball" || p.result === "hit_by_pitch") {
        balls++;
      } else if (p.result === "called_strike" || p.result === "swinging_strike") {
        strikes++;
      } else if (p.result === "foul") {
        if (strikes < 2) strikes++;
      }
    }
    if (strikes >= 3 && !oppSelectedResult) {
      const lastStrikePitch = [...currentPitches].reverse().find(
        (p) => p.result === "called_strike" || p.result === "swinging_strike"
      );
      setOppSelectedResult(
        lastStrikePitch?.result === "called_strike"
          ? "strikeout_looking"
          : "strikeout_swinging"
      );
    } else if (balls >= 4 && !oppSelectedResult) {
      const lastPitch = currentPitches[currentPitches.length - 1];
      setOppSelectedResult(lastPitch?.result === "hit_by_pitch" ? "hbp" : "walk");
    }
  }, [currentPitches, oppSelectedResult]);

  // Our batting
  const activeBatterIndex = manualBatterIndex ?? currentBatterIndex;
  const currentBatter = game?.lineupEntries?.[activeBatterIndex];

  // Opponent batting
  const activeOppBatterIndex = manualOppBatterIndex ?? currentOppBatterIndex;
  const currentOppBatter = game?.opponentBatters?.[activeOppBatterIndex];

  const handleRecordAtBat = async () => {
    if (!selectedResult || !currentBatter || !game) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      await apiFetch(`/api/games/${gameId}/at-bats`, {
        method: "POST",
        body: JSON.stringify({
          playerId: currentBatter.playerId,
          opponentPitcherId: selectedPitcherId || null,
          result: selectedResult,
          rbi,
          runnerScored,
          stolenBases,
          caughtStealing,
          hitLocationX: hitLocation?.x ?? null,
          hitLocationY: hitLocation?.y ?? null,
        }),
      });

      setSelectedResult(null);
      setRbi(0);
      setRunnerScored(false);
      setStolenBases(0);
      setCaughtStealing(0);
      setHitLocation(null);
      setManualBatterIndex(null);

      await fetchGame();
    } catch {
      setErrorMsg("Failed to record at-bat. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordOppAtBat = async () => {
    if (!oppSelectedResult || !currentOppBatter || !game) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const atBat = await apiFetch(`/api/games/${gameId}/at-bats`, {
        method: "POST",
        body: JSON.stringify({
          opponentBatterId: currentOppBatter.id,
          result: oppSelectedResult,
          rbi: oppRbi,
          runnerScored: oppRunnerScored,
          hitLocationX: oppHitLocation?.x ?? null,
          hitLocationY: oppHitLocation?.y ?? null,
        }),
      });

      // Save collected pitches for this at-bat
      if (currentPitches.length > 0) {
        for (const pitch of currentPitches) {
          await apiFetch(`/api/games/${gameId}/at-bats/${atBat.id}/pitches`, {
            method: "POST",
            body: JSON.stringify({
              result: pitch.result,
              locationX: pitch.locationX,
              locationY: pitch.locationY,
            }),
          });
        }
      }

      setOppSelectedResult(null);
      setOppRbi(0);
      setOppRunnerScored(false);
      setOppHitLocation(null);
      setManualOppBatterIndex(null);
      setCurrentPitches([]);
      setPitchLocation(null);
      setSelectedPitchResult(null);

      await fetchGame();
    } catch {
      setErrorMsg("Failed to record opponent at-bat. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPitch = () => {
    if (!selectedPitchResult) return;
    setCurrentPitches([
      ...currentPitches,
      {
        result: selectedPitchResult,
        locationX: pitchLocation?.x ?? null,
        locationY: pitchLocation?.y ?? null,
      },
    ]);
    setPitchLocation(null);
    setSelectedPitchResult(null);
  };

  const handleRemoveLastPitch = () => {
    setCurrentPitches(currentPitches.slice(0, -1));
  };

  const handleUndo = async () => {
    if (!game || game.atBats.length === 0) return;
    const lastAtBat = game.atBats[game.atBats.length - 1];
    try {
      await apiFetch(`/api/games/${gameId}/at-bats/${lastAtBat.id}`, {
        method: "DELETE",
      });
      await fetchGame();
    } catch {
      // handle
    }
  };

  const handleEditAtBat = async () => {
    if (!editingAtBatId) return;
    try {
      await apiFetch(`/api/games/${gameId}/at-bats/${editingAtBatId}`, {
        method: "PATCH",
        body: JSON.stringify({ stolenBases: editSB, caughtStealing: editCS }),
      });
      setEditingAtBatId(null);
      await fetchGame();
    } catch {
      // handle
    }
  };

  const handleEndGame = async () => {
    try {
      await apiFetch(`/api/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "final" }),
      });
      await fetchGame();
    } catch {
      // handle
    }
  };

  const handleAddPitcher = async () => {
    if (!newPitcherName.trim()) return;
    try {
      const pitcher = await apiFetch(`/api/games/${gameId}/opponent-pitchers`, {
        method: "POST",
        body: JSON.stringify({
          name: newPitcherName.trim(),
          throwsHand: newPitcherHand,
        }),
      });
      setSelectedPitcherId(pitcher.id);
      setNewPitcherName("");
      setShowPitcherModal(false);
      await fetchGame();
    } catch {
      // handle
    }
  };

  const handleAddBatter = async () => {
    if (!newBatterName.trim()) return;
    try {
      await apiFetch(`/api/games/${gameId}/opponent-batters`, {
        method: "POST",
        body: JSON.stringify({
          name: newBatterName.trim(),
          jerseyNumber: newBatterNumber ? parseInt(newBatterNumber) : null,
          bats: newBatterHand,
        }),
      });
      setNewBatterName("");
      setNewBatterNumber("");
      setShowBatterModal(false);
      await fetchGame();
    } catch {
      // handle
    }
  };

  const openLineupSetup = async () => {
    if (!game) return;
    try {
      const players = await apiFetch(`/api/teams/${game.teamId}/players`);
      setAvailablePlayers(players);
      setLineupDraft(
        players.slice(0, 10).map((p: Player) => ({
          playerId: p.id,
          position: p.primaryPosition || "DH",
        }))
      );
      setShowLineupSetup(true);
    } catch {
      // handle
    }
  };

  const handleSaveLineup = async () => {
    if (!game || lineupDraft.length === 0) return;
    try {
      await apiFetch(`/api/games/${gameId}/lineup`, {
        method: "PUT",
        body: JSON.stringify({
          lineup: lineupDraft.map((entry, idx) => ({
            playerId: entry.playerId,
            battingOrder: idx + 1,
            position: entry.position,
          })),
        }),
      });
      setShowLineupSetup(false);
      await fetchGame();
    } catch {
      // handle
    }
  };

  const addToLineup = (playerId: string) => {
    const player = availablePlayers.find((p) => p.id === playerId);
    if (!player) return;
    setLineupDraft([
      ...lineupDraft,
      { playerId, position: player.primaryPosition || "DH" },
    ]);
  };

  const removeFromLineup = (index: number) => {
    setLineupDraft(lineupDraft.filter((_, i) => i !== index));
  };

  const moveInLineup = (index: number, direction: "up" | "down") => {
    const newDraft = [...lineupDraft];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newDraft.length) return;
    [newDraft[index], newDraft[target]] = [newDraft[target], newDraft[index]];
    setLineupDraft(newDraft);
  };

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

  const isFinal = game.status === "final";

  // Pitch count for current at-bat in progress
  let countBalls = 0;
  let countStrikes = 0;
  for (const p of currentPitches) {
    if (p.result === "ball" || p.result === "hit_by_pitch") {
      countBalls++;
    } else if (p.result === "called_strike" || p.result === "swinging_strike") {
      countStrikes++;
    } else if (p.result === "foul") {
      if (countStrikes < 2) countStrikes++;
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/teams/${game.teamId}`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          &larr; Back
        </Link>
        <div className="flex gap-2">
          <Link href={`/games/${gameId}/box`}>
            <Button variant="ghost" size="sm">Box Score</Button>
          </Link>
          {!isFinal && (
            <Button variant="danger" size="sm" onClick={() => setShowEndGameConfirm(true)}>
              End Game
            </Button>
          )}
        </div>
      </div>

      {/* Scoreboard */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {game.isHome ? "Home" : "Away"}
            </p>
            <p className="text-3xl font-bold">{game.ourScore}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {isFinal
                ? "Final"
                : `${game.isTopOfInning ? "Top" : "Bot"} ${game.currentInning}`}
            </p>
            <p className="text-sm text-gray-400">vs {game.opponentName}</p>
            {!isFinal && (
              <div className="mt-1 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-full border ${
                      i < game.outsInCurrentInning
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-400"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">outs</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {game.isHome ? "Away" : "Home"}
            </p>
            <p className="text-3xl font-bold">{game.opponentScore}</p>
          </div>
        </div>
      </Card>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {isFinal ? (
        <Card className="text-center">
          <p className="text-lg font-semibold">Game Over</p>
          <p className="text-sm text-gray-500">
            Final Score: {game.ourScore} - {game.opponentScore}
          </p>
        </Card>
      ) : (
        <>
          {/* Scoring Mode Toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setScoringMode("our_batting")}
              className={`flex-1 rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${
                scoringMode === "our_batting"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              Our Team Batting
            </button>
            <button
              onClick={() => setScoringMode("opponent_batting")}
              className={`flex-1 rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${
                scoringMode === "opponent_batting"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {game.opponentName} Batting
            </button>
          </div>

          {/* ========== OUR TEAM BATTING ========== */}
          {scoringMode === "our_batting" && (
            <>
              {game.lineupEntries.length === 0 ? (
                <Card className="text-center">
                  <p className="mb-2 text-gray-500">No lineup set yet.</p>
                  <Button onClick={openLineupSetup}>Set Lineup</Button>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          {manualBatterIndex !== null ? "Selected Player" : "Now Batting"}
                        </p>
                        <p className="text-lg font-bold">
                          #{currentBatter?.player?.jerseyNumber ?? "-"}{" "}
                          {currentBatter?.player?.firstName} {currentBatter?.player?.lastName}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {currentBatter?.position} | Spot #{(activeBatterIndex + 1)}
                        {manualBatterIndex !== null && (
                          <button
                            onClick={() => setManualBatterIndex(null)}
                            className="ml-2 text-xs text-blue-600 hover:underline"
                          >
                            Back to next up
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Opponent Pitcher */}
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Pitcher:</span>
                      <select
                        value={selectedPitcherId}
                        onChange={(e) => setSelectedPitcherId(e.target.value)}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                      >
                        <option value="">Unknown</option>
                        {game.opponentPitchers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.throwsHand === "left" ? "L" : "R"})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowPitcherModal(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        + New
                      </button>
                    </div>

                    {/* Result Buttons */}
                    <ResultButtons
                      selectedResult={selectedResult}
                      onSelectResult={setSelectedResult}
                    />

                    {/* Extras (RBI, SB, etc.) */}
                    <ExtrasPanel
                      rbi={rbi}
                      setRbi={setRbi}
                      runnerScored={runnerScored}
                      setRunnerScored={setRunnerScored}
                      stolenBases={stolenBases}
                      setStolenBases={setStolenBases}
                      caughtStealing={caughtStealing}
                      setCaughtStealing={setCaughtStealing}
                    />

                    {/* Spray Chart */}
                    {selectedResult && !["walk", "hbp", "ibb", "catchers_interference", "strikeout_swinging", "strikeout_looking"].includes(selectedResult) && (
                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
                          Ball Location (tap the field)
                        </p>
                        <SprayChartDiamond
                          interactive
                          selectedLocation={hitLocation}
                          onLocationSelect={setHitLocation}
                          hits={[]}
                          size={250}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleUndo}
                        disabled={game.atBats.length === 0}
                      >
                        Undo Last
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleRecordAtBat}
                        disabled={!selectedResult || submitting}
                      >
                        {submitting ? "Recording..." : "Record At-Bat"}
                      </Button>
                    </div>
                  </Card>

                  {/* Lineup */}
                  <Card>
                    <h3 className="mb-2 text-sm font-semibold">Batting Order</h3>
                    <p className="mb-2 text-xs text-gray-400">Tap a player to record SB, CS, or other actions</p>
                    <div className="space-y-1">
                      {game.lineupEntries.map((entry, idx) => (
                        <button
                          key={entry.id}
                          onClick={() => setManualBatterIndex(idx === activeBatterIndex ? null : idx)}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-left transition-colors ${
                            idx === activeBatterIndex
                              ? "bg-blue-50 font-medium ring-1 ring-blue-300 dark:bg-blue-900/30 dark:ring-blue-700"
                              : idx === currentBatterIndex
                              ? "bg-gray-50 dark:bg-gray-800/50"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <span>
                            {idx + 1}. #{entry.player.jerseyNumber ?? "-"}{" "}
                            {entry.player.firstName} {entry.player.lastName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{entry.position}</span>
                            {idx === currentBatterIndex && manualBatterIndex !== null && (
                              <span className="text-xs text-blue-500">next up</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}

          {/* ========== OPPONENT BATTING ========== */}
          {scoringMode === "opponent_batting" && (
            <>
              {(!game.opponentBatters || game.opponentBatters.length === 0) ? (
                <Card className="text-center">
                  <p className="mb-2 text-gray-500">
                    No opponent batters added yet.
                  </p>
                  <Button onClick={() => setShowBatterModal(true)}>
                    Add Opponent Batter
                  </Button>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-red-500 uppercase">
                          {manualOppBatterIndex !== null ? "Selected Batter" : "Now Batting"} ({game.opponentName})
                        </p>
                        <p className="text-lg font-bold">
                          #{currentOppBatter?.jerseyNumber ?? "-"}{" "}
                          {currentOppBatter?.name}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {currentOppBatter?.bats === "left" ? "L" : currentOppBatter?.bats === "switch" ? "S" : "R"} | Spot #{(activeOppBatterIndex + 1)}
                        {manualOppBatterIndex !== null && (
                          <button
                            onClick={() => setManualOppBatterIndex(null)}
                            className="ml-2 text-xs text-red-600 hover:underline"
                          >
                            Back to next up
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Our Pitcher */}
                    {game.pitchingAppearances && game.pitchingAppearances.length > 0 && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Our Pitcher:</span>
                        <select
                          value={selectedOurPitcherId}
                          onChange={(e) => setSelectedOurPitcherId(e.target.value)}
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                        >
                          {game.pitchingAppearances.map((pa) => (
                            <option key={pa.id} value={pa.id}>
                              {pa.player ? `${pa.player.firstName} ${pa.player.lastName}` : "Unknown"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Pitch Tracking */}
                    <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">
                          Pitch Tracking
                        </h4>
                        <span className="text-sm font-mono font-bold">
                          {countBalls}-{countStrikes}
                        </span>
                      </div>

                      {/* Pitch sequence display */}
                      {currentPitches.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {currentPitches.map((p, i) => (
                            <span
                              key={i}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: PITCH_RESULT_COLORS[p.result] || "#6b7280" }}
                              title={PITCH_RESULT_LABELS[p.result]}
                            >
                              {i + 1}
                            </span>
                          ))}
                          <button
                            onClick={handleRemoveLastPitch}
                            className="inline-flex h-6 items-center rounded px-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Undo
                          </button>
                        </div>
                      )}

                      {/* Strike Zone + Pitch result buttons */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <StrikeZone
                            interactive
                            selectedLocation={pitchLocation}
                            onLocationSelect={setPitchLocation}
                            pitches={currentPitches.map((p, i) => ({
                              x: p.locationX ?? 0.5,
                              y: p.locationY ?? 0.5,
                              result: p.result,
                              pitchNumber: i + 1,
                            }))}
                            size={160}
                          />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {PITCH_RESULTS.map((result) => (
                            <button
                              key={result}
                              onClick={() => setSelectedPitchResult(result)}
                              className={`block w-full rounded border px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                                selectedPitchResult === result
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span
                                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: PITCH_RESULT_COLORS[result] }}
                              />
                              {PITCH_RESULT_LABELS[result]}
                            </button>
                          ))}
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={handleAddPitch}
                            disabled={!selectedPitchResult}
                          >
                            + Add Pitch
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* At-Bat Result Buttons */}
                    <ResultButtons
                      selectedResult={oppSelectedResult}
                      onSelectResult={setOppSelectedResult}
                    />

                    {/* Extras (RBI, Scored) */}
                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div>
                        <label className="text-xs text-gray-500">RBI</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setOppRbi(Math.max(0, oppRbi - 1))}
                            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-medium">{oppRbi}</span>
                          <button
                            onClick={() => setOppRbi(oppRbi + 1)}
                            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Scored</label>
                        <button
                          onClick={() => setOppRunnerScored(!oppRunnerScored)}
                          className={`mt-1 block rounded-lg border px-3 py-1 text-sm ${
                            oppRunnerScored
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {oppRunnerScored ? "Yes" : "No"}
                        </button>
                      </div>
                    </div>

                    {/* Spray Chart for opponent batted balls */}
                    {oppSelectedResult && !["walk", "hbp", "ibb", "catchers_interference", "strikeout_swinging", "strikeout_looking"].includes(oppSelectedResult) && (
                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
                          Ball Location (tap the field)
                        </p>
                        <SprayChartDiamond
                          interactive
                          selectedLocation={oppHitLocation}
                          onLocationSelect={setOppHitLocation}
                          hits={[]}
                          size={250}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleUndo}
                        disabled={game.atBats.length === 0}
                      >
                        Undo Last
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleRecordOppAtBat}
                        disabled={!oppSelectedResult || submitting}
                      >
                        {submitting ? "Recording..." : `Record ${game.opponentName} At-Bat`}
                      </Button>
                    </div>
                  </Card>

                  {/* Opponent Batting Order */}
                  <Card>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{game.opponentName} Batting Order</h3>
                      <button
                        onClick={() => setShowBatterModal(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        + Add Batter
                      </button>
                    </div>
                    <div className="space-y-1">
                      {game.opponentBatters.map((batter, idx) => (
                        <button
                          key={batter.id}
                          onClick={() => setManualOppBatterIndex(idx === activeOppBatterIndex ? null : idx)}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-left transition-colors ${
                            idx === activeOppBatterIndex
                              ? "bg-red-50 font-medium ring-1 ring-red-300 dark:bg-red-900/30 dark:ring-red-700"
                              : idx === currentOppBatterIndex
                              ? "bg-gray-50 dark:bg-gray-800/50"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <span>
                            {idx + 1}. #{batter.jerseyNumber ?? "-"}{" "}
                            {batter.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {batter.bats === "left" ? "L" : batter.bats === "switch" ? "S" : "R"}
                            </span>
                            {idx === currentOppBatterIndex && manualOppBatterIndex !== null && (
                              <span className="text-xs text-red-500">next up</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Game Log */}
          <Card>
            <h3 className="mb-2 text-sm font-semibold">Game Log <span className="font-normal text-gray-400">(tap to edit SB/CS)</span></h3>
            {game.atBats.length === 0 ? (
              <p className="text-sm text-gray-400">No at-bats recorded yet</p>
            ) : (
              <div className="max-h-72 space-y-1 overflow-y-auto">
                {[...game.atBats].reverse().map((ab) => {
                  const isOurs = !!ab.playerId;
                  const batterName = isOurs
                    ? (ab.player ? `${ab.player.firstName} ${ab.player.lastName}` : "Unknown")
                    : ab.opponentBatter?.name || "Unknown";
                  const isEditing = editingAtBatId === ab.id;
                  return (
                    <div key={ab.id}>
                      <div
                        onClick={() => {
                          if (isEditing) {
                            setEditingAtBatId(null);
                          } else {
                            setEditingAtBatId(ab.id);
                            setEditSB(ab.stolenBases);
                            setEditCS(ab.caughtStealing);
                          }
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm ${
                          isEditing
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : isOurs
                            ? "odd:bg-gray-50 dark:odd:bg-gray-800/50"
                            : "odd:bg-red-50/50 dark:odd:bg-red-900/10"
                        }`}
                      >
                        <span>
                          {!isOurs && (
                            <span className="mr-1 text-xs text-red-500">[OPP]</span>
                          )}
                          <span className="font-medium">{batterName}</span>
                          {" - "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {RESULT_LABELS[ab.result] || ab.result}
                          </span>
                          {ab.rbi > 0 && (
                            <span className="ml-1 text-xs text-green-600">
                              ({ab.rbi} RBI)
                            </span>
                          )}
                          {ab.stolenBases > 0 && (
                            <span className="ml-1 text-xs text-blue-600">
                              ({ab.stolenBases} SB)
                            </span>
                          )}
                          {ab.caughtStealing > 0 && (
                            <span className="ml-1 text-xs text-red-600">
                              ({ab.caughtStealing} CS)
                            </span>
                          )}
                          {ab.pitches && ab.pitches.length > 0 && (
                            <span className="ml-1 text-xs text-gray-400">
                              ({ab.pitches.length}p)
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {ab.isTop ? "Top" : "Bot"} {ab.inning}
                        </span>
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-4 rounded-b bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">SB</span>
                            <button onClick={() => setEditSB(Math.max(0, editSB - 1))} className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">-</button>
                            <span className="w-4 text-center text-sm font-medium">{editSB}</span>
                            <button onClick={() => setEditSB(editSB + 1)} className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">+</button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">CS</span>
                            <button onClick={() => setEditCS(Math.max(0, editCS - 1))} className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">-</button>
                            <span className="w-4 text-center text-sm font-medium">{editCS}</span>
                            <button onClick={() => setEditCS(editCS + 1)} className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">+</button>
                          </div>
                          <button
                            onClick={handleEditAtBat}
                            className="ml-auto rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Add Pitcher Modal */}
      <Modal
        isOpen={showPitcherModal}
        onClose={() => setShowPitcherModal(false)}
        title="Add Opponent Pitcher"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              value={newPitcherName}
              onChange={(e) => setNewPitcherName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder="Pitcher name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Throws
            </label>
            <div className="mt-1 flex gap-3">
              <button
                onClick={() => setNewPitcherHand("right")}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  newPitcherHand === "right"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                Right
              </button>
              <button
                onClick={() => setNewPitcherHand("left")}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  newPitcherHand === "left"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                Left
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowPitcherModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPitcher}>Add Pitcher</Button>
          </div>
        </div>
      </Modal>

      {/* Add Opponent Batter Modal */}
      <Modal
        isOpen={showBatterModal}
        onClose={() => setShowBatterModal(false)}
        title={`Add ${game.opponentName} Batter`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              value={newBatterName}
              onChange={(e) => setNewBatterName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder="Batter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jersey # (optional)
            </label>
            <input
              value={newBatterNumber}
              onChange={(e) => setNewBatterNumber(e.target.value)}
              type="number"
              className="mt-1 block w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder="#"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bats
            </label>
            <div className="mt-1 flex gap-3">
              {["right", "left", "switch"].map((hand) => (
                <button
                  key={hand}
                  onClick={() => setNewBatterHand(hand)}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize ${
                    newBatterHand === hand
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {hand === "switch" ? "Switch" : hand === "left" ? "Left" : "Right"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowBatterModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBatter}>Add Batter</Button>
          </div>
        </div>
      </Modal>

      {/* Lineup Setup Modal */}
      <Modal
        isOpen={showLineupSetup}
        onClose={() => setShowLineupSetup(false)}
        title="Set Batting Order"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            {lineupDraft.map((entry, idx) => {
              const player = availablePlayers.find((p) => p.id === entry.playerId);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700"
                >
                  <span className="w-6 text-center font-medium text-gray-500">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium">
                    #{player?.jerseyNumber ?? "-"} {player?.firstName}{" "}
                    {player?.lastName}
                  </span>
                  <select
                    value={entry.position}
                    onChange={(e) => {
                      const updated = [...lineupDraft];
                      updated[idx] = { ...entry, position: e.target.value };
                      setLineupDraft(updated);
                    }}
                    className="rounded border border-gray-300 px-1 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800"
                  >
                    {["P","C","1B","2B","3B","SS","LF","CF","RF","DH","EH"].map(
                      (pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={() => moveInLineup(idx, "up")}
                    disabled={idx === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveInLineup(idx, "down")}
                    disabled={idx === lineupDraft.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    &#9660;
                  </button>
                  <button
                    onClick={() => removeFromLineup(idx)}
                    className="text-red-400 hover:text-red-600"
                  >
                    &#10005;
                  </button>
                </div>
              );
            })}
          </div>

          {availablePlayers.filter(
            (p) => !lineupDraft.some((e) => e.playerId === p.id)
          ).length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                Add to lineup:
              </p>
              <div className="flex flex-wrap gap-1">
                {availablePlayers
                  .filter((p) => !lineupDraft.some((e) => e.playerId === p.id))
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToLineup(p.id)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                      #{p.jerseyNumber ?? "-"} {p.firstName} {p.lastName}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowLineupSetup(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLineup}
              disabled={lineupDraft.length === 0}
            >
              Save Lineup ({lineupDraft.length} players)
            </Button>
          </div>
        </div>
      </Modal>

      {/* End Game Confirmation Modal */}
      <Modal
        isOpen={showEndGameConfirm}
        onClose={() => setShowEndGameConfirm(false)}
        title="End Game?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will mark the game as final with a score of{" "}
            <strong>{game.ourScore} - {game.opponentScore}</strong>.
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowEndGameConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                setShowEndGameConfirm(false);
                await handleEndGame();
              }}
            >
              End Game
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ========== Shared Sub-Components ==========

function ResultButtons({
  selectedResult,
  onSelectResult,
}: {
  selectedResult: string | null;
  onSelectResult: (result: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">Hits</p>
        <div className="grid grid-cols-4 gap-2">
          {AT_BAT_RESULTS.hits.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">Walks</p>
        <div className="grid grid-cols-4 gap-2">
          {AT_BAT_RESULTS.walks.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">Outs</p>
        <div className="grid grid-cols-5 gap-2">
          {AT_BAT_RESULTS.outs.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-1 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExtrasPanel({
  rbi,
  setRbi,
  runnerScored,
  setRunnerScored,
  stolenBases,
  setStolenBases,
  caughtStealing,
  setCaughtStealing,
}: {
  rbi: number;
  setRbi: (v: number) => void;
  runnerScored: boolean;
  setRunnerScored: (v: boolean) => void;
  stolenBases: number;
  setStolenBases: (v: number) => void;
  caughtStealing: number;
  setCaughtStealing: (v: number) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:grid-cols-4">
      <div>
        <label className="text-xs text-gray-500">RBI</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRbi(Math.max(0, rbi - 1))}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            -
          </button>
          <span className="w-6 text-center font-medium">{rbi}</span>
          <button
            onClick={() => setRbi(rbi + 1)}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500">Scored</label>
        <button
          onClick={() => setRunnerScored(!runnerScored)}
          className={`mt-1 block rounded-lg border px-3 py-1 text-sm ${
            runnerScored
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          {runnerScored ? "Yes" : "No"}
        </button>
      </div>
      <div>
        <label className="text-xs text-gray-500">SB</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStolenBases(Math.max(0, stolenBases - 1))}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            -
          </button>
          <span className="w-6 text-center font-medium">{stolenBases}</span>
          <button
            onClick={() => setStolenBases(stolenBases + 1)}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500">CS</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCaughtStealing(Math.max(0, caughtStealing - 1))}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            -
          </button>
          <span className="w-6 text-center font-medium">{caughtStealing}</span>
          <button
            onClick={() => setCaughtStealing(caughtStealing + 1)}
            className="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
