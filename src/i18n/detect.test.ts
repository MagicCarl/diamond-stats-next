import { describe, it, expect } from "vitest";
import { pickLocaleFromAcceptLanguage } from "./detect";

describe("pickLocaleFromAcceptLanguage", () => {
  it("matches an exact supported locale", () => {
    expect(pickLocaleFromAcceptLanguage("es-MX,es;q=0.9")).toBe("es");
  });
  it("matches Traditional Chinese", () => {
    expect(pickLocaleFromAcceptLanguage("zh-Hant-TW,zh;q=0.8")).toBe("zh-Hant");
  });
  it("falls back to default when nothing matches", () => {
    expect(pickLocaleFromAcceptLanguage("fr-FR,de;q=0.7")).toBe("en");
  });
  it("falls back to default on empty header", () => {
    expect(pickLocaleFromAcceptLanguage("")).toBe("en");
  });
  it("respects quality-value ordering", () => {
    expect(pickLocaleFromAcceptLanguage("ko;q=0.4,ja;q=0.9")).toBe("ja");
  });
});
