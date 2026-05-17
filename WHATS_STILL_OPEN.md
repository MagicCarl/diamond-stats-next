# What's Still Open

SEO follow-ups deferred from the 2026-05-16 landing-page audit.

## `aggregateRating` on SoftwareApplication

Skipped because there are no reviews yet. Once you have 3+ honest testimonials:

1. Add a `Review` array and `aggregateRating` object to the `SoftwareApplication` JSON-LD in [src/app/layout.tsx](src/app/layout.tsx).
2. Star ratings will become eligible to appear in Google SERPs.
3. Reviews must be real and FTC-compliant — don't fabricate.

Example shape:

```json
{
  "@type": "SoftwareApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "12"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Coach Smith" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "reviewBody": "..."
    }
  ]
}
```

## `priceValidUntil` expiration

Currently set to `2027-12-31` in the `Offer` schema at [src/app/layout.tsx](src/app/layout.tsx). Google de-ranks listings with expired offers.

- Set a calendar reminder for late 2027 to roll the date forward.
- Or change to a rolling value computed at build time.
