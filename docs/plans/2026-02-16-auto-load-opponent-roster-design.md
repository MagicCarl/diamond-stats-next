# Auto-load Opponent Roster

## Problem
When a game is started against an opponent that has been faced before, the user must re-enter the entire opponent batting roster manually. This is tedious and error-prone.

## Solution
When the live scoring page loads and the game has zero opponent batters, automatically copy the roster from the most recent previous game against the same opponent.

## Approach: Load on live page

### New API Endpoint
`POST /api/games/[gameId]/opponent-batters/load-from-previous`

1. Get the current game's `opponentName` and `teamId`
2. Find the most recent other game with the same `opponentName` and `teamId` that has opponent batters
3. Bulk-create opponent batters in the current game (copying `name`, `jerseyNumber`, `bats`, sequential `orderInGame`)
4. Return created batters or empty array if no previous game found

### Frontend Change
In `src/app/(app)/games/[gameId]/live/page.tsx`, after `fetchGame()` resolves:
- If `game.opponentBatters.length === 0`, call the new endpoint
- If batters were created, re-fetch the game to update UI

### What doesn't change
- No schema changes
- No changes to game creation flow
- Existing add/remove batter functionality unchanged
- If no previous game exists for that opponent, current "Add Opponent Batter" flow works as before
