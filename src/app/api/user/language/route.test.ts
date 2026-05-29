import { describe, it, expect } from "vitest";
import { languageSchema } from "./schema";

describe("languageSchema", () => {
  it("accepts supported locales", () => {
    expect(languageSchema.safeParse({ language: "ja" }).success).toBe(true);
  });
  it("rejects unsupported locales", () => {
    expect(languageSchema.safeParse({ language: "fr" }).success).toBe(false);
  });
  it("rejects missing language", () => {
    expect(languageSchema.safeParse({}).success).toBe(false);
  });
});
