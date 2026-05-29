import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { SUPPORTED_LOCALES } from "./config";

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === "object"
      ? flatten(v as Record<string, unknown>, key)
      : [key];
  });
}

const keysFor = (l: string) =>
  flatten(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))).sort();

describe("i18n key parity", () => {
  const en = keysFor("en");
  for (const locale of SUPPORTED_LOCALES.filter((l) => l !== "en")) {
    it(`${locale} has exactly the same keys as en`, () => {
      expect(keysFor(locale)).toEqual(en);
    });
  }
});
