"use client";

import { useTranslations } from "next-intl";
import Select from "@/components/ui/Select";
import { GAME_LENGTHS, LEVELS, SPORTS, suggestedInnings } from "@/lib/constants";

export interface TeamSettingsValues {
  sport: string;
  level: string;
  defaultInnings: number;
}

// Sport, level and game length for the create-team and team-settings forms.
// Changing sport or level re-suggests the game length, unless the coach has
// already picked a custom one.
export default function TeamSettingsFields({
  value,
  onChange,
  idPrefix,
}: {
  value: TeamSettingsValues;
  onChange: (next: TeamSettingsValues) => void;
  idPrefix: string;
}) {
  const t = useTranslations("dashboard");

  const update = (patch: Partial<Pick<TeamSettingsValues, "sport" | "level">>) => {
    const next = { ...value, ...patch };
    const wasSuggested = value.defaultInnings === suggestedInnings(value.sport, value.level);
    onChange(wasSuggested ? { ...next, defaultInnings: suggestedInnings(next.sport, next.level) } : next);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id={`${idPrefix}Sport`}
          label={t("sportLabel")}
          value={value.sport}
          onChange={(e) => update({ sport: e.target.value })}
          options={SPORTS.map((s) => ({ value: s, label: t(s) }))}
        />
        <Select
          id={`${idPrefix}Level`}
          label={t("levelLabel")}
          value={value.level}
          onChange={(e) => update({ level: e.target.value })}
          options={LEVELS.map((l) => ({ value: l.value, label: l.label }))}
        />
      </div>
      <div>
        <Select
          id={`${idPrefix}Innings`}
          label={t("gameLengthLabel")}
          value={String(value.defaultInnings)}
          onChange={(e) => onChange({ ...value, defaultInnings: parseInt(e.target.value) })}
          options={GAME_LENGTHS.map((n) => ({ value: String(n), label: t("inningsOption", { count: n }) }))}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("gameLengthHint")}</p>
      </div>
    </>
  );
}
