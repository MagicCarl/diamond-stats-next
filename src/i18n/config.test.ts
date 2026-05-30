import { describe, it, expect } from "vitest";
import { isLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_FLAGS } from "./config";

describe("locale config", () => {
  it("includes the five supported locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "es", "ja", "ko", "zh-Hant"]);
  });
  it("defaults to English", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });
  it("has a native display name for every locale", () => {
    for (const l of SUPPORTED_LOCALES) {
      expect(LOCALE_NAMES[l]).toBeTruthy();
    }
  });
  it("has a flag for every locale", () => {
    for (const l of SUPPORTED_LOCALES) {
      expect(LOCALE_FLAGS[l]).toBeTruthy();
    }
  });
  it("isLocale accepts supported, rejects others", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("zh-Hant")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(123)).toBe(false);
  });
});
