"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";

export default function InstructionsPage() {
  const t = useTranslations("instructions");

  const rich = {
    b: (c: ReactNode) => <strong>{c}</strong>,
    em: (c: ReactNode) => <em>{c}</em>,
    badge: (c: ReactNode) => (
      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        {c}
      </span>
    ),
    blue: (c: ReactNode) => (
      <span className="text-blue-500 font-medium">{c}</span>
    ),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Getting Started */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("gettingStarted")}</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("gs1", rich)}</li>
          <li>{t.rich("gs2", rich)}</li>
          <li>{t.rich("gs3", rich)}</li>
          <li>{t.rich("gs4", rich)}</li>
          <li>{t.rich("gs5", rich)}</li>
        </ol>
      </Card>

      {/* Pre-Game Setup */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("preGame")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("preGameIntro")}
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("pg1", rich)}</li>
          <li>{t.rich("pg2", rich)}</li>
          <li>{t.rich("pg3", rich)}</li>
        </ol>
      </Card>

      {/* Live Scoring */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("liveScoring")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("liveIntro")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("scoreboard")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("scoreboardText")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("modeToggle")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("modeToggleText", rich)}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("recordingOurs")}</h3>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t("ro1")}</li>
          <li>{t("ro2")}</li>
          <li>{t("ro3")}</li>
          <li>{t("ro4")}</li>
          <li>{t("ro5")}</li>
          <li>{t("ro6")}</li>
          <li>{t.rich("ro7", rich)}</li>
        </ol>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("recordingOursNote")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("recordingOpp")}</h3>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("rop1", rich)}</li>
          <li>{t("rop2")}</li>
          <li>{t("rop3")}</li>
          <li>{t("rop4")}</li>
          <li>{t.rich("rop5", rich)}</li>
        </ol>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("selectBatter")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("selectBatterText")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("autoInning")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("autoInningText")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("realTimeSync")}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t("realTimeSyncText")}
        </p>
      </Card>

      {/* Pitch Tracking */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("pitchTracking")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("pitchTrackingIntro", rich)}
        </p>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("pt1", rich)}</li>
          <li>{t("pt2")}</li>
        </ol>
        <div className="mb-3 ml-6 grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-300">
          <div><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1.5 align-middle" />{t.rich("pitchCS", rich)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-red-700 mr-1.5 align-middle" />{t.rich("pitchSS", rich)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1.5 align-middle" />{t.rich("pitchF", rich)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1.5 align-middle" />{t.rich("pitchB", rich)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1.5 align-middle" />{t.rich("pitchIP", rich)}</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1.5 align-middle" />{t.rich("pitchHBP", rich)}</div>
        </div>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300" start={3}>
          <li>{t.rich("pt3", rich)}</li>
          <li>{t.rich("pt4", rich)}</li>
          <li>{t.rich("pt5", rich)}</li>
          <li>{t("pt6")}</li>
        </ol>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t("pitchTrackingNote")}
        </p>
      </Card>

      {/* At-Bat Result Buttons */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("atBatResults")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("atBatResultsIntro")}
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-1 font-semibold text-green-600 dark:text-green-400">{t("hits")}</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div>{t.rich("resultSingle", rich)}</div>
              <div>{t.rich("resultDouble", rich)}</div>
              <div>{t.rich("resultTriple", rich)}</div>
              <div>{t.rich("resultHR", rich)}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-purple-600 dark:text-purple-400">{t("walksReached")}</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div>{t.rich("resultBB", rich)}</div>
              <div>{t.rich("resultHBP", rich)}</div>
              <div>{t.rich("resultIBB", rich)}</div>
              <div>{t.rich("resultCI", rich)}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-gray-500">{t("outs")}</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div>{t.rich("resultKS", rich)}</div>
              <div>{t.rich("resultKL", rich)}</div>
              <div>{t.rich("resultGO", rich)}</div>
              <div>{t.rich("resultFO", rich)}</div>
              <div>{t.rich("resultLO", rich)}</div>
              <div>{t.rich("resultPO", rich)}</div>
              <div>{t.rich("resultFC", rich)}</div>
              <div>{t.rich("resultDP", rich)}</div>
              <div>{t.rich("resultSF", rich)}</div>
              <div>{t.rich("resultSAC", rich)}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-yellow-600 dark:text-yellow-400">{t("other")}</h3>
            <div className="text-gray-700 dark:text-gray-300">
              <div>{t.rich("resultE", rich)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t.rich("atBatNote", rich)}
          </p>
        </div>
      </Card>

      {/* At-Bat Extras */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("atBatExtras")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("atBatExtrasIntro")}
        </p>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>{t.rich("extraRBI", rich)}</p>
          <p>{t.rich("extraScored", rich)}</p>
          <p>{t.rich("extraSB", rich)}</p>
          <p>{t.rich("extraCS", rich)}</p>
          <p>{t.rich("extraHitLoc", rich)}</p>
        </div>

        <h3 className="mt-4 mb-2 text-sm font-semibold text-gray-500 uppercase">{t("editingPrev")}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t.rich("editingPrevText", rich)}
        </p>
      </Card>

      {/* Opponent Tracking */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("opponentTracking")}</h2>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("oppPitchers")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("oppPitchersText", rich)}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("oppBatters")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("oppBattersText", rich)}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("yourPitching")}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t("yourPitchingText")}
        </p>
      </Card>

      {/* Spray Charts */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("sprayCharts")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("sprayChartsText")}
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("viewingSpray")}</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("viewingSprayIntro")}
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("viewSpray1", rich)}</li>
          <li>{t.rich("viewSpray2", rich)}</li>
          <li>{t.rich("viewSpray3", rich)}</li>
        </ul>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">{t("colorCoding")}</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> {t("colorSingles")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> {t("colorDoubles")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-orange-500" /> {t("colorTriples")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> {t("colorHomeRuns")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-gray-500" /> {t("colorOuts")}
          </span>
        </div>
      </Card>

      {/* Box Score */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("boxScore")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t("boxScoreIntro")}
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("boxScore1", rich)}</li>
          <li>{t.rich("boxScore2", rich)}</li>
          <li>{t.rich("boxScore3", rich)}</li>
        </ul>
      </Card>

      {/* Season Stats */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("seasonStats")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("seasonStatsIntro", rich)}
        </p>
        <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          <p className="mb-2">{t("seasonStatsColIntro")}</p>
          <div className="grid grid-cols-2 gap-1">
            <div>{t.rich("colG", rich)}</div>
            <div>{t.rich("colAB", rich)}</div>
            <div>{t.rich("colH", rich)}</div>
            <div>{t.rich("col2B", rich)}</div>
            <div>{t.rich("col3B", rich)}</div>
            <div>{t.rich("colHR", rich)}</div>
            <div>{t.rich("colRBI", rich)}</div>
            <div>{t.rich("colBB", rich)}</div>
            <div>{t.rich("colK", rich)}</div>
            <div>{t.rich("colSB", rich)}</div>
            <div>{t.rich("colAVG", rich)}</div>
            <div>{t.rich("colOBP", rich)}</div>
            <div>{t.rich("colSLG", rich)}</div>
            <div>{t.rich("colOPS", rich)}</div>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t("seasonStatsRecord")}
        </p>
      </Card>

      {/* Advanced Stats Search */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("advSearch")}</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          {t.rich("advSearchIntro", rich)}
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("advSearch1", rich)}</li>
          <li>{t.rich("advSearch2", rich)}</li>
          <li>{t.rich("advSearch3", rich)}</li>
          <li>{t.rich("advSearch4", rich)}</li>
          <li>{t.rich("advSearch5", rich)}</li>
        </ul>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t("advSearchNote")}
        </p>
      </Card>

      {/* Stats Explained */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("statsCalc")}</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold">{t("paHead")}</h3>
            <p>{t("paText")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("abHead")}</h3>
            <p>{t("abText")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("avgHead")}</h3>
            <p>{t.rich("avgText", rich)}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("obpHead")}</h3>
            <p>{t("obpText")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("slgHead")}</h3>
            <p>{t("slgText")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("opsHead")}</h3>
            <p>{t("opsText")}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("sbPctHead")}</h3>
            <p>{t("sbPctText")}</p>
          </div>
        </div>
      </Card>

      {/* Game Management */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("gameMgmt")}</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>{t.rich("mgmtUndo", rich)}</p>
          <p>{t.rich("mgmtEndGame", rich)}</p>
          <p>{t.rich("mgmtBoxScore", rich)}</p>
          <p>{t.rich("mgmtSprayChart", rich)}</p>
          <p>{t.rich("mgmtStatus", rich)}</p>
          <p>{t.rich("mgmtDeleteAll", rich)}</p>
        </div>
      </Card>

      {/* Step-by-Step Scoring Guide */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("stepByStep")}</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("step1", rich)}</li>
          <li>{t.rich("step2", rich)}</li>
          <li>{t.rich("step3", rich)}</li>
          <li>{t.rich("step4", rich)}</li>
          <li>{t.rich("step5", rich)}</li>
          <li>{t.rich("step6", rich)}</li>
          <li>{t.rich("step7", rich)}</li>
        </ol>
      </Card>

      {/* Quick Reference */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("quickRef")}</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>{t.rich("quickDarkMode", rich)}</p>
          <p>{t.rich("quickSignOut", rich)}</p>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("tips")}</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t.rich("tip1", rich)}</li>
          <li>{t.rich("tip2", rich)}</li>
          <li>{t("tip3")}</li>
          <li>{t.rich("tip4", rich)}</li>
          <li>{t("tip5")}</li>
          <li>{t.rich("tip6", rich)}</li>
          <li>{t("tip7")}</li>
          <li>{t("tip8")}</li>
          <li>{t("tip9")}</li>
          <li>{t("tip10")}</li>
        </ul>
      </Card>
    </div>
  );
}
