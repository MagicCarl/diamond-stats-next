import { AT_BAT_RESULTS } from "./constants";

interface AtBatData {
  result: string;
  rbi: number;
  stolenBases: number;
  caughtStealing: number;
  runnerScored: boolean;
}

export interface BattingStats {
  games: number;
  plateAppearances: number;
  atBats: number;
  hits: number;
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  hbp: number;
  sacrificeFlies: number;
  sacrificeBunts: number;
  stolenBases: number;
  caughtStealing: number;
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  sbPct: string;
}

const isHit = (result: string) =>
  (AT_BAT_RESULTS.hits as readonly string[]).includes(result);

const isWalk = (result: string) =>
  result === "walk" || result === "hbp" || result === "ibb" || result === "catchers_interference";

const isAtBat = (result: string) =>
  !isWalk(result) && result !== "sacrifice_fly" && result !== "sacrifice_bunt";

export function calcBattingStats(
  atBats: AtBatData[],
  gameCount: number
): BattingStats {
  const hits = atBats.filter((ab) => isHit(ab.result)).length;
  const singles = atBats.filter((ab) => ab.result === "single").length;
  const doubles = atBats.filter((ab) => ab.result === "double").length;
  const triples = atBats.filter((ab) => ab.result === "triple").length;
  const homeRuns = atBats.filter((ab) => ab.result === "home_run").length;
  const walks = atBats.filter(
    (ab) => ab.result === "walk" || ab.result === "ibb"
  ).length;
  const hbp = atBats.filter((ab) => ab.result === "hbp").length;
  const ci = atBats.filter((ab) => ab.result === "catchers_interference").length;
  const strikeouts = atBats.filter(
    (ab) =>
      ab.result === "strikeout_swinging" || ab.result === "strikeout_looking"
  ).length;
  const sacFlies = atBats.filter(
    (ab) => ab.result === "sacrifice_fly"
  ).length;
  const sacBunts = atBats.filter(
    (ab) => ab.result === "sacrifice_bunt"
  ).length;
  const sb = atBats.reduce((sum, ab) => sum + ab.stolenBases, 0);
  const cs = atBats.reduce((sum, ab) => sum + ab.caughtStealing, 0);
  const rbi = atBats.reduce((sum, ab) => sum + ab.rbi, 0);

  const officialAtBats = atBats.filter((ab) => isAtBat(ab.result)).length;
  const plateAppearances = atBats.length;

  const totalBases = singles + doubles * 2 + triples * 3 + homeRuns * 4;

  const avg = officialAtBats > 0 ? hits / officialAtBats : 0;
  const obp =
    plateAppearances > 0
      ? (hits + walks + hbp + ci) / plateAppearances
      : 0;
  const slg = officialAtBats > 0 ? totalBases / officialAtBats : 0;
  const sbPct = sb + cs > 0 ? sb / (sb + cs) : 0;

  return {
    games: gameCount,
    plateAppearances,
    atBats: officialAtBats,
    hits,
    singles,
    doubles,
    triples,
    homeRuns,
    rbi,
    walks,
    strikeouts,
    hbp,
    sacrificeFlies: sacFlies,
    sacrificeBunts: sacBunts,
    stolenBases: sb,
    caughtStealing: cs,
    avg: avg.toFixed(3).replace(/^0/, ""),
    obp: obp.toFixed(3).replace(/^0/, ""),
    slg: slg.toFixed(3).replace(/^0/, ""),
    ops: (obp + slg).toFixed(3).replace(/^0/, ""),
    sbPct: (sbPct * 100).toFixed(0) + "%",
  };
}

export function getOutsProduced(result: string): number {
  switch (result) {
    case "groundout":
    case "flyout":
    case "lineout":
    case "popout":
    case "fielders_choice":
    case "strikeout_swinging":
    case "strikeout_looking":
    case "sacrifice_fly":
    case "sacrifice_bunt":
      return 1;
    case "double_play":
      return 2;
    default:
      return 0;
  }
}
