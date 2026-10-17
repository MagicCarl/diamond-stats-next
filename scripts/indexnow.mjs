// Tells Bing (and other IndexNow engines) that site pages changed, so they get
// recrawled within hours instead of weeks. ChatGPT search leans on Bing's index.
// Run after a deploy that changes public pages:  npm run indexnow
// Optional: pass specific URLs to submit only those, otherwise every sitemap URL is sent.

const HOST = "www.baseballstatstracker.com";
const KEY = "f5b46e3f9ebbd96b655188bfe14f4acf"; // must match public/<KEY>.txt

let urls = process.argv.slice(2);
if (urls.length === 0) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

// 200 = accepted, 202 = accepted pending key check; anything else is a failure.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URLs`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
