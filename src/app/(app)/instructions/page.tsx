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
      <span className="rounded bg-blue-100 px-2 py-0.5 text-base font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        {c}
      </span>
    ),
    blue: (c: ReactNode) => (
      <span className="text-blue-500 font-medium">{c}</span>
    ),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>

      {/* Getting Started */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("gettingStarted")}</h2>
        <ol className="list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("gs1", rich)}</li>
          <li>{t.rich("gs2", rich)}</li>
          <li>{t.rich("gs3", rich)}</li>
          <li>{t.rich("gs4", rich)}</li>
          <li>{t.rich("gs5", rich)}</li>
        </ol>
      </Card>

      {/* Pre-Game Setup */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("preGame")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("preGameIntro")}
        </p>
        <ol className="list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("pg1", rich)}</li>
          <li>{t.rich("pg2", rich)}</li>
          <li>{t.rich("pg3", rich)}</li>
        </ol>
      </Card>

      {/* Live Scoring */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("liveScoring")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("liveIntro")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("scoreboard")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("scoreboardText")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("modeToggle")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("modeToggleText", rich)}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("recordingOurs")}</h3>
        <ol className="mb-3 list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t("ro1")}</li>
          <li>{t("ro2")}</li>
          <li>{t("ro3")}</li>
          <li>{t("ro4")}</li>
          <li>{t("ro5")}</li>
          <li>{t("ro6")}</li>
          <li>{t.rich("ro7", rich)}</li>
        </ol>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("recordingOursNote")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("recordingOpp")}</h3>
        <ol className="mb-3 list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("rop1", rich)}</li>
          <li>{t("rop2")}</li>
          <li>{t("rop3")}</li>
          <li>{t("rop4")}</li>
          <li>{t.rich("rop5", rich)}</li>
        </ol>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("selectBatter")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("selectBatterText")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("autoInning")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("autoInningText")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("realTimeSync")}</h3>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("realTimeSyncText")}
        </p>
      </Card>

      {/* Sharing with Family & Friends */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("shareFamily")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("shareFamilyIntro")}
        </p>
        <ol className="mb-3 list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("sfs1", rich)}</li>
          <li>{t.rich("sfs2", rich)}</li>
          <li>{t.rich("sfs3", rich)}</li>
          <li>{t.rich("sfs4", rich)}</li>
        </ol>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p className="text-base text-gray-700 dark:text-gray-300">
            {t("shareFamilyNote")}
          </p>
        </div>
      </Card>

      {/* Pitch Tracking */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("pitchTracking")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("pitchTrackingIntro", rich)}
        </p>
        <ol className="mb-3 list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("pt1", rich)}</li>
          <li>{t("pt2")}</li>
        </ol>
        <div className="mb-4 ml-6 grid grid-cols-1 gap-2 sm:grid-cols-2 text-lg text-gray-700 dark:text-gray-300">
          <div><span className="inline-block w-4 h-4 rounded-full bg-red-500 mr-1.5 align-middle" />{t.rich("pitchCS", rich)}</div>
          <div><span className="inline-block w-4 h-4 rounded-full bg-red-700 mr-1.5 align-middle" />{t.rich("pitchSS", rich)}</div>
          <div><span className="inline-block w-4 h-4 rounded-full bg-orange-500 mr-1.5 align-middle" />{t.rich("pitchF", rich)}</div>
          <div><span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-1.5 align-middle" />{t.rich("pitchB", rich)}</div>
          <div><span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-1.5 align-middle" />{t.rich("pitchIP", rich)}</div>
          <div><span className="inline-block w-4 h-4 rounded-full bg-purple-500 mr-1.5 align-middle" />{t.rich("pitchHBP", rich)}</div>
        </div>
        <ol className="mb-3 list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200" start={3}>
          <li>{t.rich("pt3", rich)}</li>
          <li>{t.rich("pt4", rich)}</li>
          <li>{t.rich("pt5", rich)}</li>
          <li>{t("pt6")}</li>
        </ol>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("pitchTrackingNote")}
        </p>
      </Card>

      {/* At-Bat Result Buttons */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("atBatResults")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("atBatResultsIntro")}
        </p>

        <div className="space-y-5 text-lg leading-relaxed">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400">{t("hits")}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-gray-800 dark:text-gray-300">
              <div>{t.rich("resultSingle", rich)}</div>
              <div>{t.rich("resultDouble", rich)}</div>
              <div>{t.rich("resultTriple", rich)}</div>
              <div>{t.rich("resultHR", rich)}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-purple-600 dark:text-purple-400">{t("walksReached")}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-gray-800 dark:text-gray-300">
              <div>{t.rich("resultBB", rich)}</div>
              <div>{t.rich("resultHBP", rich)}</div>
              <div>{t.rich("resultIBB", rich)}</div>
              <div>{t.rich("resultCI", rich)}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-500">{t("outs")}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-gray-800 dark:text-gray-300">
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
            <h3 className="mb-2 text-lg font-semibold text-yellow-600 dark:text-yellow-400">{t("other")}</h3>
            <div className="text-gray-700 dark:text-gray-300">
              <div>{t.rich("resultE", rich)}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p className="text-base text-gray-700 dark:text-gray-300">
            {t.rich("atBatNote", rich)}
          </p>
        </div>
      </Card>

      {/* At-Bat Extras */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("atBatExtras")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("atBatExtrasIntro")}
        </p>
        <div className="space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <p>{t.rich("extraRBI", rich)}</p>
          <p>{t.rich("extraScored", rich)}</p>
          <p>{t.rich("extraSB", rich)}</p>
          <p>{t.rich("extraCS", rich)}</p>
          <p>{t.rich("extraHitLoc", rich)}</p>
        </div>

        <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("editingPrev")}</h3>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("editingPrevText", rich)}
        </p>
      </Card>

      {/* Opponent Tracking */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("opponentTracking")}</h2>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("oppPitchers")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("oppPitchersText", rich)}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("oppBatters")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("oppBattersText", rich)}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("yourPitching")}</h3>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("yourPitchingText")}
        </p>
      </Card>

      {/* Spray Charts */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("sprayCharts")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("sprayChartsText")}
        </p>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("viewingSpray")}</h3>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("viewingSprayIntro")}
        </p>
        <ul className="mb-3 list-outside list-disc pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("viewSpray1", rich)}</li>
          <li>{t.rich("viewSpray2", rich)}</li>
          <li>{t.rich("viewSpray3", rich)}</li>
        </ul>

        <h3 className="mt-5 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("colorCoding")}</h3>
        <div className="flex flex-wrap gap-4 text-lg">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-full bg-green-500" /> {t("colorSingles")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-full bg-blue-500" /> {t("colorDoubles")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-full bg-orange-500" /> {t("colorTriples")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-full bg-red-500" /> {t("colorHomeRuns")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-full bg-gray-500" /> {t("colorOuts")}
          </span>
        </div>
      </Card>

      {/* Box Score */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("boxScore")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("boxScoreIntro")}
        </p>
        <ul className="mb-3 list-outside list-disc pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("boxScore1", rich)}</li>
          <li>{t.rich("boxScore2", rich)}</li>
          <li>{t.rich("boxScore3", rich)}</li>
        </ul>
      </Card>

      {/* Season Stats */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("seasonStats")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("seasonStatsIntro", rich)}
        </p>
        <div className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <p className="mb-2">{t("seasonStatsColIntro")}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("seasonStatsRecord", rich)}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("teamSprayCharts", rich)}
        </p>
      </Card>

      {/* Advanced Stats Search */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("advSearch")}</h2>
        <p className="mb-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t.rich("advSearchIntro", rich)}
        </p>
        <ul className="mb-3 list-outside list-disc pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <li>{t.rich("advSearch1", rich)}</li>
          <li>{t.rich("advSearch2", rich)}</li>
          <li>{t.rich("advSearch3", rich)}</li>
          <li>{t.rich("advSearch4", rich)}</li>
          <li>{t.rich("advSearch5", rich)}</li>
        </ul>
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {t("advSearchNote")}
        </p>
      </Card>

      {/* Stats Explained */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("statsCalc")}</h2>
        <div className="space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
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
          <div>
            <h3 className="font-semibold">{t("eraHead")}</h3>
            <p>{t.rich("eraText", rich)}</p>
          </div>
        </div>
      </Card>

      {/* Game Management */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("gameMgmt")}</h2>
        <div className="space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
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
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("stepByStep")}</h2>
        <ol className="list-outside list-decimal pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
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
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("quickRef")}</h2>
        <div className="space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <p>{t.rich("quickDarkMode", rich)}</p>
          <p>{t.rich("quickSignOut", rich)}</p>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t("tips")}</h2>
        <ul className="list-outside list-disc pl-6 space-y-3 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
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
