# My Baseball Stats

Youth and amateur baseball statistics tracking app. One-time $39 purchase via PayPal.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Database**: PostgreSQL (Supabase) via Prisma ORM with PgBouncer
- **Auth**: Firebase Authentication (email/password + Google OAuth)
- **Payments**: PayPal (manual verification) with Stripe SDK available
- **Styling**: Tailwind CSS v4, next-themes for dark mode
- **Hosting**: Vercel (frontend), Supabase (database), Firebase (auth)

## Project Structure

```
src/
  app/
    (app)/           # Authenticated app pages (dashboard, games, teams, stats)
    (auth)/          # Login and signup pages
    api/             # API routes (REST endpoints)
    page.tsx         # Landing page
  components/
    layout/          # NavBar
    ui/              # Button, Card, Input, Modal, Select, Spinner, ThemeToggle
    pitch-chart/     # StrikeZone component
    spray-chart/     # SprayChartDiamond component
  hooks/             # useApi (authenticated fetch wrapper)
  lib/               # auth, firebase-admin, firebase-client, prisma, stats, stripe, constants
  providers/         # AuthProvider, ThemeProvider
  types/             # TypeScript interfaces
prisma/
  schema.prisma      # Database schema
  migrations/        # Migration files
```

## Key Architecture Decisions

- **Auth flow**: Firebase handles authentication. `/api/auth/verify` syncs Firebase user to Prisma DB. `getAuthUser()` in `lib/auth.ts` verifies tokens and does a fast `findUnique` (only upserts for new users).
- **Multi-tenancy**: Users own Organizations, which contain Teams. All API queries scope by `organization.ownerId` to enforce data isolation.
- **Scoring model**: `runnerScored` is a stat field tracking whether the batter scored. `rbi` is used for score calculation. Only RBI updates the game score.
- **OBP formula**: `(H + BB + HBP + CI) / (AB + BB + HBP + SF + CI)` - standard MLB formula.
- **Database**: Uses PgBouncer (port 6543) for queries, direct connection (port 5432) via `DIRECT_URL` for migrations.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx prisma generate  # Regenerate Prisma client (runs via postinstall)
npx prisma migrate deploy  # Apply migrations in production
npx prisma db push   # Push schema changes in development
```

## Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL` - Supabase PostgreSQL connection string (PgBouncer)
- `DIRECT_URL` - Direct PostgreSQL connection for migrations
- `NEXT_PUBLIC_FIREBASE_*` - Firebase client config (6 vars)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` - Firebase Admin
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe (server)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe (client)

## Data Models

- **User** -> Organization -> Team -> Players, Seasons, Games
- **Game** -> LineupEntries, AtBats, PitchingAppearances, OpponentPitchers, OpponentBatters
- **AtBat** -> Pitches (optional pitch-by-pitch tracking)

## Important Patterns

- All API routes use `getAuthUser(req)` for auth and scope queries by `organization.ownerId`
- `isPaid` check only on game creation (`POST /api/games`)
- Admin routes check `user.isAdmin` flag
- The health endpoint (`/api/health`) requires admin auth for detailed info
- Lineup updates use a Prisma transaction (delete + create atomically)
- Stats calculations in `lib/stats.ts` - `calcBattingStats()` and `getOutsProduced()`
- Live scoring page polls every 3s for real-time sync across devices

## Payment Model

- One-time $39 purchase via PayPal.me link
- Admin manually toggles `isPaid` flag via admin panel
- Free users can view data; creating games requires paid status
