import { readFileSync } from "node:fs";

const LOCALES = ["en", "es", "ja", "ko", "zh-Hant"];
const flatten = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) => {
    const key = p ? `${p}.${k}` : k;
    return v && typeof v === "object" ? flatten(v, key) : [key];
  });
const keys = (l) =>
  new Set(flatten(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))));

const en = keys("en");
let ok = true;
for (const l of LOCALES.filter((x) => x !== "en")) {
  const k = keys(l);
  const missing = [...en].filter((x) => !k.has(x));
  const extra = [...k].filter((x) => !en.has(x));
  if (missing.length || extra.length) {
    ok = false;
    console.error(`\n${l}:`);
    if (missing.length) console.error("  missing:", missing.join(", "));
    if (extra.length) console.error("  extra:", extra.join(", "));
  }
}
console.log(ok ? "i18n parity OK" : "i18n parity FAILED");
process.exit(ok ? 0 : 1);
