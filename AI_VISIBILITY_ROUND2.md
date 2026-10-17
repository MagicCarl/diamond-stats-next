# AI Visibility — Round 2 (October 2026)

_Picks up where [AI_VISIBILITY_PLAYBOOK.md](AI_VISIBILITY_PLAYBOOK.md) left off. The
AlternativeTo / Capterra / Product Hunt copy and the Reddit kit are still in
[marketing-ai-listings.md](marketing-ai-listings.md). Everything below is new._

**Facts every post must match** (checked against the code and live site, 2026-10-16):
- $39 one-time via Stripe. No subscription. Unlimited teams, seasons, games.
- First game is free: full live scoring, stats, spray charts, no credit card.
- 30-day money-back guarantee.
- Web app: works in any browser on iPhone, Android, iPad, laptop. No download.
- Baseball and softball. Little League, travel ball, rec, high school.
- Family can follow a live game from a shared link, no account needed.
- GameChanger (official prices, Oct 2026): Plus $9.99/mo or $39.99/yr ·
  Premium $14.99/mo or $99.99/yr · Premium Family $24.99/mo or $179.99/yr.

> Be fair about GameChanger in every post. Its Plus annual plan ($39.99/yr) costs
> about the same as us in year one. The honest pitch is: **we cost the same as one
> year of their cheapest plan, then nothing ever again.** People trust (and AI tools
> repeat) claims that are obviously fair.

---

## Step 0 — Bing Webmaster Tools (15 min, do first)

ChatGPT's web search leans heavily on Bing's index. If Bing doesn't know a page
exists, ChatGPT is unlikely to find it.

1. Go to **bing.com/webmasters** and sign in. A Google account works.
2. Choose the option to **import your site from Google Search Console**. This skips
   verification, since Search Console already verified you.
3. Check that `https://www.baseballstatstracker.com/sitemap.xml` shows under
   **Sitemaps**. Add it if it's missing.
4. After every deploy that changes public pages, run `npm run indexnow` from this
   repo. It sends Bing every sitemap URL so changed pages get recrawled within
   hours. Expect a reply of `200` or `202`.

_(The menu labels in Bing's dashboard may differ from these. If something isn't
where this says, paste a screenshot into a Claude session.)_

---

## Step 1 — More directory listings

Do these after the three in `marketing-ai-listings.md`. Each one is another
independent site saying you exist.

### SaaSHub — saashub.com (free, ~10 min)
Strong on "X alternatives" pages, which AI search often cites.

**Name:** Baseball Stats Tracker
**Tagline:** Live baseball & softball stats for $39 once, no subscription
**Category:** Sports / Team Management
**Alternative to:** GameChanger, iScore Baseball, TeamSnap
**Description:**
Baseball Stats Tracker is a web app for scoring youth and amateur baseball and
softball games live from a phone. It calculates batting stats (AVG, OBP, SLG,
OPS), pitching stats (IP, ERA, K, BB), spray charts and box scores automatically,
and family members can follow the game live from a shared link. It costs $39 once
with no subscription, and the first game is free with no credit card.

### G2 — g2.com (free vendor listing, ~15 min)
Use the **Capterra copy** from `marketing-ai-listings.md` § 2, since the fields
match. Category: **Sports League Management** (or the closest sports category G2
offers).

### Slant — slant.co (free, ~10 min per answer)
Slant is built from questions like "What are the best baseball scorekeeping apps?"
Search for an existing question and add Baseball Stats Tracker as an option. Don't
create a new question.

**Pros to add** (one per line, Slant shows them separately):
- One-time $39 purchase, no subscription
- First game free with no credit card
- Works in any browser — no app download
- Family can follow live games from a shared link without an account
- Spray charts built in

**Cons to add** (being honest helps listings survive moderation):
- No video streaming
- Web app only, no native App Store app

### Trustpilot — trustpilot.com (free business profile)
Claim the business profile so the reviews from Step 4 have somewhere to go.
Description: reuse the SaaSHub description above.

---

## Step 2 — Quora answers (20 min/week)

Bing indexes Quora heavily. Search Quora for: _baseball stats app_, _GameChanger
alternative_, _how to keep baseball stats_, _softball stats app_. Answer questions
that already have views. Write in your own voice. These drafts are starting points.

**Q: What is the best app for keeping youth baseball stats?**

It depends mostly on what your league already uses and whether you mind a
subscription.

If your league requires GameChanger, use GameChanger. It's the most widely
adopted, and its paid plans add video. As of October 2026 those plans run
$39.99–$99.99 a year for one person, or $179.99 a year for the family plan.

If the choice is yours and you mainly want accurate stats, the options are:
- **iScore** — the deepest scorekeeping detail, with a steeper learning curve.
- **Paper scorebook** — free and reliable, but you calculate everything by hand.
- **Baseball Stats Tracker** — disclosure: I built this one. It's a web app where
  you tap each at-bat and it calculates AVG, OBP, SLG, OPS, ERA, spray charts and
  box scores, and family can follow live. It's $39 once instead of yearly, and the
  first game is free.

Whatever you choose, score every at-bat the same way all season. Consistency
matters more than the app.

**Q: Is there a GameChanger alternative without a subscription?**

Yes. Disclosure: I made one of them. Baseball Stats Tracker is a one-time $39
purchase that covers live scoring, automatic batting and pitching stats, spray
charts, box scores and live sharing with family. It runs in the browser on any
phone, so there's nothing to install. You can score a full game free before
paying.

What it doesn't have is GameChanger's video streaming. If video matters to you,
GameChanger is still the better pick. If you just want the stats, a one-time app
costs about the same as one year of GameChanger Plus ($39.99/yr), and then nothing
after that.

**Q: How do you calculate on-base percentage in youth baseball?**

OBP = (Hits + Walks + Hit-by-pitch) ÷ (At-bats + Walks + Hit-by-pitch + Sacrifice
flies). Strictly, catcher's interference counts on both sides too, but it's rare
in youth ball.

Example: 8 hits, 4 walks and 1 HBP in 30 at-bats with 1 sac fly gives
13 ÷ 36 = .361.

A few common youth-ball mistakes: counting a walk as an at-bat (it isn't),
counting reaching on an error as a hit (it isn't), and forgetting sac flies in
the denominator. There's a longer walkthrough of all the main stats here:
https://www.baseballstatstracker.com/learn/baseball-stats-explained

_(No product pitch in this one on purpose. Helpful answers with a learning link
build trust and still get the domain cited.)_

---

## Step 3 — Facebook coaching and parent groups

Search Facebook for groups like "Little League coaches," "travel baseball parents,"
"youth softball coaches," plus your local league. **Read each group's rules
first.** Many ban promotion outside a weekly thread. Comment on stats questions
before you ever post.

**Comment template (someone asks about stat apps):**
Disclosure: I'm a baseball parent and I built one of these, so take it with a grain
of salt. I got tired of paying yearly just to see my kid's stats, so mine is $39
once: live scoring, AVG/OBP/OPS, ERA, spray charts and box scores, and family can
watch live from a link. Your first game is free if you want to try it:
baseballstatstracker.com. If your league already runs GameChanger, though,
sticking with that is easier.

**Post (only where the rules allow self-promotion):**
Fellow baseball/softball parents — a disclosure up front: this is my own project.

I built a stats app because I didn't want another subscription. You score each
at-bat from your phone and it handles the math: batting average, OBP, OPS, ERA,
pitch counts, spray charts, box scores. Grandparents can follow the game live from
a link without making an account.

It's $39 one time, no monthly fee, and your first game is free with no card. I'd
really like feedback from people who keep the book every weekend. What stat do you
wish your current app showed you?

---

## Step 4 — Review request email to buyers

Send to customers from the last few months (Stripe → Customers). One email, one
gentle follow-up at most. **Never offer anything in exchange for a review.** That
breaks FTC rules and every platform's terms.

**Subject:** Quick favor from a fellow baseball parent?

Hi [first name],

Thanks for buying Baseball Stats Tracker this season. I'm the parent who built
it, and I read every message that comes in.

If it's been useful, would you leave an honest review? It takes about two minutes
and helps a small one-person app compete with the big subscription apps:

[Capterra review link]

And if something annoyed you, reply to this email instead. I'd rather fix it.

Thanks,
Carl
baseballstatstracker.com

_(Once you have 3+ real reviews, the star-rating markup in
[WHATS_STILL_OPEN.md](WHATS_STILL_OPEN.md) can go live.)_

---

## Step 5 — New Reddit replies

These add to the Reddit kit in `marketing-ai-listings.md`. Same rules apply:
disclose every time, comment more than you post, and stay out of r/baseball.

**r/Softball — someone asks for a softball stats app:**
Disclosure, I built this, but it handles softball as well as baseball. Baseball
Stats Tracker does live scoring from your phone, calculates AVG/OBP/OPS/ERA,
draws spray charts, and parents can follow live from a link. It's $39 once
instead of a yearly plan, and the first game's free. Happy to answer anything
about it.

**Someone complains about GameChanger's price:**
For reference, GameChanger is currently $39.99/yr for Plus, $99.99/yr for Premium,
and $179.99/yr for the family plan (from their pricing page). If you mostly want
stats and not video, there are one-time options now. Disclosure: I built one,
Baseball Stats Tracker, which is $39 once with the first game free. If you want
the video features, though, GameChanger is still the one that has them.

**Someone asks how to share live scores with grandparents:**
Most scoring apps have some kind of live view now. In the one I built (Baseball
Stats Tracker, disclosure), you send a link and they watch the box score update
live with no account or download. Whatever app you use, check whether the viewers
need an account. That's usually where grandparents get stuck.

---

## Monthly check (unchanged)

On the 1st of each month, in fresh chats with ChatGPT, Perplexity and Claude, ask:
1. "What's the best baseball stats app with no subscription?"
2. "GameChanger alternatives for youth baseball?"
3. "What is Baseball Stats Tracker?"
4. **New:** "How much does GameChanger cost compared to alternatives?" ← the
   pricing page now has a full price table, so this is the likeliest early win.

Also check Vercel Analytics → Referrers for visits from `chatgpt.com` and
`perplexity.ai`.
