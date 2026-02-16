"use client";

import Card from "@/components/ui/Card";

export default function InstructionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">How to Use My Baseball Stats</h1>

      {/* Getting Started */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Getting Started</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Create a Team</strong> &mdash; From the Dashboard, tap{" "}
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ New Team</span>{" "}
            and enter your team name and level (Little League, Travel, Recreational, High School, or College).
          </li>
          <li>
            <strong>Add Players</strong> &mdash; Open your team page and tap{" "}
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ Add Player</span>.
            Enter each player&apos;s first name, last name, jersey number, batting hand (Right, Left, or Switch), throwing hand, and primary position.
          </li>
          <li>
            <strong>Edit Players</strong> &mdash; Need to make a change? Tap the{" "}
            <span className="text-blue-500 font-medium">Edit</span> button next to any player
            in the roster to update their name, jersey number, position, or handedness.
          </li>
          <li>
            <strong>Create a Season</strong> &mdash; Tap{" "}
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ Season</span>{" "}
            on your team page to add a season (e.g., &ldquo;Spring 2026&rdquo;). Seasons let you group games and filter stats over time.
          </li>
          <li>
            <strong>Schedule a Game</strong> &mdash; Tap{" "}
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ New Game</span>,
            enter the opponent name, game date, time, location, whether you&apos;re home or away, and the number of innings. Optionally assign the game to a season.
          </li>
        </ol>
      </Card>

      {/* Pre-Game Setup */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Pre-Game Setup</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Before first pitch, open your game and get everything ready:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Set Your Lineup</strong> &mdash; Tap <strong>Set Lineup</strong> on the live scoring page. Add players from your roster to the batting order, assign each a defensive position for this game, and drag to reorder. Save when you&apos;re ready.
          </li>
          <li>
            <strong>Add Opponent Pitchers</strong> &mdash; When your team is batting, use the pitcher dropdown and tap <strong>+ New</strong> to add the starting pitcher&apos;s name and throwing hand (Left or Right). You can add relief pitchers as the game progresses.
          </li>
          <li>
            <strong>Add Opponent Batters</strong> &mdash; Switch to <strong>Opponent Batting</strong> mode and tap{" "}
            <strong>+ Add Batter</strong> to add opposing batters with their name, jersey number, and batting hand. You can add these as each batter comes up.
          </li>
        </ol>
      </Card>

      {/* Live Scoring */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Live Scoring</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The Live Scoring page is the primary screen you use at the field. Open any game and you&apos;re ready to go.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">The Scoreboard</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The scoreboard at the top shows the current score, inning (Top or Bottom), and outs count. Everything updates automatically as you record at-bats.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Scoring Mode Toggle</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Use the toggle at the top to switch between <strong>Our Team Batting</strong> (blue) and <strong>Opponent Batting</strong> (red). This determines whose at-bats you are recording and ensures the score updates for the correct team.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Recording Your Team&apos;s At-Bats</h3>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>The current batter is shown automatically based on your lineup order.</li>
          <li>Select the opposing pitcher from the dropdown (or add a new one if a pitching change occurs).</li>
          <li>Choose the at-bat result from the buttons below (see At-Bat Results section).</li>
          <li>Adjust RBI count and mark if the runner scored using the +/- buttons.</li>
          <li>Record stolen bases or caught stealing if applicable.</li>
          <li>For batted balls, tap the spray chart diamond to record where the ball was hit.</li>
          <li>Tap <strong>Record At-Bat</strong> to save.</li>
        </ol>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The app automatically tracks outs, advances innings (3 outs ends the half-inning), and updates the score.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Recording Opponent At-Bats</h3>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Switch to <strong>Opponent Batting</strong> mode using the toggle.</li>
          <li>The current opponent batter is shown automatically (or add a new batter).</li>
          <li>Optionally track individual pitches using the pitch tracking panel (see Pitch Tracking section below).</li>
          <li>Select the at-bat result, set RBI/runs scored, and tap the spray chart for batted balls.</li>
          <li>Tap <strong>Record Opponent At-Bat</strong> to save.</li>
        </ol>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Selecting a Different Batter</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Need to record an at-bat for someone out of order? Tap any player in the batting order list to select them. Tap again or use &ldquo;Back to next up&rdquo; to return to the automatic rotation.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Automatic Inning Tracking</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Three outs automatically end the half-inning. The app switches from Top to Bottom (or Bottom to Top with an inning increment). Outs reset to zero for the new half-inning. Double plays count as 2 outs.
        </p>
      </Card>

      {/* Pitch Tracking */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Pitch Tracking</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          When in <strong>Opponent Batting</strong> mode, use the pitch tracking panel to record each pitch <em>before</em> logging the at-bat result. This tracks your pitcher&apos;s performance and builds a pitch-by-pitch record.
        </p>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Tap the <strong>strike zone diagram</strong> to mark where the pitch was located.</li>
          <li>Select the pitch result button:</li>
        </ol>
        <div className="mb-3 ml-6 grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-300">
          <div><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1.5 align-middle" /><strong>CS</strong> &mdash; Called Strike</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-red-700 mr-1.5 align-middle" /><strong>SS</strong> &mdash; Swinging Strike</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1.5 align-middle" /><strong>F</strong> &mdash; Foul Ball</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1.5 align-middle" /><strong>B</strong> &mdash; Ball</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1.5 align-middle" /><strong>IP</strong> &mdash; In Play</div>
          <div><span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1.5 align-middle" /><strong>HBP</strong> &mdash; Hit By Pitch</div>
        </div>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300" start={3}>
          <li>Tap <strong>+ Add Pitch</strong> to log the pitch. It appears as a numbered circle on the strike zone.</li>
          <li>The ball-strike count updates automatically. Foul balls do <em>not</em> add a strike when already at 2 strikes.</li>
          <li>Use <strong>Undo</strong> to remove the last pitch if you make a mistake.</li>
          <li>Once the pitch sequence is complete, record the at-bat result as usual.</li>
        </ol>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          All pitches are saved with the at-bat and visible in the game log, including the total pitch count for each at-bat.
        </p>
      </Card>

      {/* At-Bat Result Buttons */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">At-Bat Results</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Select one of these outcomes for each at-bat:
        </p>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="mb-1 font-semibold text-green-600 dark:text-green-400">Hits</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div><strong>1B</strong> &mdash; Single</div>
              <div><strong>2B</strong> &mdash; Double</div>
              <div><strong>3B</strong> &mdash; Triple</div>
              <div><strong>HR</strong> &mdash; Home Run</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-purple-600 dark:text-purple-400">Walks / Reached Base</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div><strong>BB</strong> &mdash; Base on Balls (Walk)</div>
              <div><strong>HBP</strong> &mdash; Hit By Pitch</div>
              <div><strong>IBB</strong> &mdash; Intentional Walk</div>
              <div><strong>CI</strong> &mdash; Catcher&apos;s Interference</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-gray-500">Outs</h3>
            <div className="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300">
              <div><strong>KS</strong> &mdash; Strikeout Swinging</div>
              <div><strong>KL</strong> &mdash; Strikeout Looking</div>
              <div><strong>GO</strong> &mdash; Groundout</div>
              <div><strong>FO</strong> &mdash; Flyout</div>
              <div><strong>LO</strong> &mdash; Lineout</div>
              <div><strong>PO</strong> &mdash; Popout</div>
              <div><strong>FC</strong> &mdash; Fielder&apos;s Choice</div>
              <div><strong>DP</strong> &mdash; Double Play (2 outs)</div>
              <div><strong>SF</strong> &mdash; Sacrifice Fly (not an official AB)</div>
              <div><strong>SAC</strong> &mdash; Sacrifice Bunt (not an official AB)</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-yellow-600 dark:text-yellow-400">Other</h3>
            <div className="text-gray-700 dark:text-gray-300">
              <div><strong>E</strong> &mdash; Error (batter reaches on a fielding error)</div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Walks (BB, IBB), Hit By Pitch (HBP), Sacrifice Fly (SF), Sacrifice Bunt (SAC), and Catcher&apos;s Interference (CI) are <em>not</em> counted as official at-bats but <em>are</em> counted as plate appearances.
          </p>
        </div>
      </Card>

      {/* At-Bat Extras */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">At-Bat Extras</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          In addition to the at-bat result, you can record the following for each plate appearance:
        </p>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>RBI</strong> &mdash; Use the +/- buttons to set how many runs batted in on this at-bat (0 or more).
          </p>
          <p>
            <strong>Runner Scored</strong> &mdash; Toggle Yes/No to indicate if the batter scored a run (e.g., on a home run or subsequent play).
          </p>
          <p>
            <strong>Stolen Bases</strong> &mdash; Use the +/- buttons if the batter stole any bases during this at-bat.
          </p>
          <p>
            <strong>Caught Stealing</strong> &mdash; Use the +/- buttons if the batter was caught stealing.
          </p>
          <p>
            <strong>Hit Location</strong> &mdash; For any batted ball (hit or out in play), tap the spray chart diamond to mark where the ball was hit or fielded.
          </p>
        </div>
      </Card>

      {/* Opponent Tracking */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Opponent Tracking</h2>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Opponent Pitchers</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          When your team is batting, select the opposing pitcher from the dropdown or tap <strong>+ New</strong> to add one.
          Enter their name and throwing hand (Left or Right). Each of your team&apos;s at-bats is linked to the opposing pitcher,
          which enables pitcher-specific stat splits later in Stats Search. Add new pitchers as relief pitchers enter the game.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Opponent Batters</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Switch to <strong>Opponent Batting</strong> mode and tap <strong>+ Add Batter</strong> to create opponent batter entries
          with name, jersey number (optional), and batting hand (Right, Left, or Switch). The app auto-rotates through opponent batters
          just like your lineup, or you can tap to manually select a batter.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Your Pitching Staff</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          When in Opponent Batting mode, the app tracks which of your team&apos;s pitchers is on the mound. This records pitching appearances
          including outs recorded, hits allowed, runs, earned runs, walks, strikeouts, home runs allowed, pitch count, hit batters, and wild pitches.
        </p>
      </Card>

      {/* Spray Charts */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Spray Charts</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          When recording any batted-ball result (hit or out in play), a baseball diamond diagram appears.
          Tap where the ball landed or was fielded to record the location. The location is saved with the at-bat.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Viewing Spray Charts</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          You can view spray charts in three ways:
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>During Live Scoring</strong> &mdash; Mark hit locations as you record at-bats.</li>
          <li><strong>Game Spray Chart</strong> &mdash; From any game, view all batted-ball locations from that single game.</li>
          <li><strong>Team Spray Chart</strong> &mdash; From your team page, view cumulative spray chart data across all games. Filter by individual player or view the whole team at once.</li>
        </ul>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Color Coding</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Singles
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Doubles
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-orange-500" /> Triples
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Home Runs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-gray-500" /> Outs
          </span>
        </div>
      </Card>

      {/* Box Score */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Box Score</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Every game has a box score that you can view during or after the game. The box score includes:
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>Game Header</strong> &mdash; Opponent name, date, final score, and game status.</li>
          <li><strong>Batting Stats Table</strong> &mdash; Each player in your lineup with AB, H, R (runs scored), RBI, BB, K (strikeouts), SB, and AVG for that game.</li>
          <li><strong>Play-by-Play Log</strong> &mdash; Chronological list of every at-bat showing the batter, result, RBI, stolen bases, and inning marker (e.g., T1, B3).</li>
        </ul>
      </Card>

      {/* Season Stats */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Season Stats</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          From your team page, tap <strong>Season Stats</strong> to see cumulative batting statistics for every player across all games.
        </p>
        <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          <p className="mb-2">The stats table includes these columns (tap a column header to sort):</p>
          <div className="grid grid-cols-2 gap-1">
            <div><strong>G</strong> &mdash; Games played</div>
            <div><strong>AB</strong> &mdash; Official at-bats</div>
            <div><strong>H</strong> &mdash; Hits</div>
            <div><strong>2B</strong> &mdash; Doubles</div>
            <div><strong>3B</strong> &mdash; Triples</div>
            <div><strong>HR</strong> &mdash; Home Runs</div>
            <div><strong>RBI</strong> &mdash; Runs Batted In</div>
            <div><strong>BB</strong> &mdash; Walks</div>
            <div><strong>K</strong> &mdash; Strikeouts</div>
            <div><strong>SB</strong> &mdash; Stolen Bases</div>
            <div><strong>AVG</strong> &mdash; Batting Average</div>
            <div><strong>OBP</strong> &mdash; On-Base Percentage</div>
            <div><strong>SLG</strong> &mdash; Slugging Percentage</div>
            <div><strong>OPS</strong> &mdash; On-Base Plus Slugging</div>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          The page also shows your team&apos;s overall record (Wins - Losses - Ties) at the top.
        </p>
      </Card>

      {/* Advanced Stats Search */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Advanced Stats Search</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The <strong>Stats Search</strong> page lets you filter and analyze your players&apos; performance with powerful filters:
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li><strong>Team</strong> &mdash; Select which of your teams to analyze.</li>
          <li><strong>Opponent</strong> &mdash; Filter by opponent team name (partial match).</li>
          <li><strong>Pitcher</strong> &mdash; Filter by opposing pitcher name (partial match).</li>
          <li><strong>Pitcher Hand</strong> &mdash; See how your players hit against lefties vs. righties.</li>
          <li><strong>Date Range</strong> &mdash; Filter by start and end dates.</li>
        </ul>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Results show each player&apos;s stats (G, AB, H, HR, RBI, BB, K, SB, AVG, OBP, OPS) for only the at-bats matching your filters.
          For example, you can see how your team hits against a specific pitcher or how they perform against left-handed pitching.
        </p>
      </Card>

      {/* Stats Explained */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">How Stats Are Calculated</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold">Plate Appearances (PA)</h3>
            <p>Total times a batter comes to the plate, including walks, HBP, sacrifices, and all other outcomes.</p>
          </div>
          <div>
            <h3 className="font-semibold">At-Bats (AB)</h3>
            <p>Plate appearances minus walks, HBP, sacrifice flies, sacrifice bunts, and catcher&apos;s interference. This is the denominator for batting average.</p>
          </div>
          <div>
            <h3 className="font-semibold">Batting Average (AVG)</h3>
            <p>Hits &divide; Official At-Bats. Walks, HBP, sacrifices, and catcher&apos;s interference are <em>not</em> counted as official at-bats.</p>
          </div>
          <div>
            <h3 className="font-semibold">On-Base Percentage (OBP)</h3>
            <p>(Hits + Walks + HBP + CI) &divide; Plate Appearances. Measures how often a batter reaches base safely.</p>
          </div>
          <div>
            <h3 className="font-semibold">Slugging Percentage (SLG)</h3>
            <p>Total Bases &divide; Official At-Bats. Singles = 1, Doubles = 2, Triples = 3, Home Runs = 4.</p>
          </div>
          <div>
            <h3 className="font-semibold">OPS (On-Base Plus Slugging)</h3>
            <p>OBP + SLG. A combined measure of a hitter&apos;s ability to get on base and hit for power.</p>
          </div>
          <div>
            <h3 className="font-semibold">Stolen Base Percentage (SB%)</h3>
            <p>Stolen Bases &divide; (Stolen Bases + Caught Stealing). Shows baserunning efficiency.</p>
          </div>
        </div>
      </Card>

      {/* Game Management */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Game Management</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Undo Last</strong> &mdash; Removes the most recent at-bat and reverts the score, outs, and inning as needed. Use this to fix mistakes.
          </p>
          <p>
            <strong>End Game</strong> &mdash; Marks the game as final. The final score is locked and the game appears with a green &ldquo;Final&rdquo; badge in your games list.
          </p>
          <p>
            <strong>Box Score</strong> &mdash; View a traditional box score with batting stats and play-by-play log at any time during or after the game.
          </p>
          <p>
            <strong>Game Spray Chart</strong> &mdash; View all batted-ball locations from the game on a color-coded diamond diagram.
          </p>
          <p>
            <strong>Game Status</strong> &mdash; Games show as &ldquo;Scheduled&rdquo; before any at-bats, &ldquo;In Progress&rdquo; with the current inning during the game, and &ldquo;Final&rdquo; after you end the game.
          </p>
        </div>
      </Card>

      {/* Step-by-Step Scoring Guide */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Step-by-Step: Scoring a Full Game</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Create the game</strong> from your team page with opponent name, date, and home/away.
          </li>
          <li>
            <strong>Set your lineup</strong> &mdash; add players and assign positions.
          </li>
          <li>
            <strong>Top of 1st (Opponent Batting)</strong> &mdash; Switch to Opponent Batting mode. Add opponent batters as they come up. Optionally track pitches for each at-bat. Record each result. After 3 outs, the inning flips automatically.
          </li>
          <li>
            <strong>Bottom of 1st (Your Team Batting)</strong> &mdash; Switch to Our Team Batting. Add the opposing pitcher. Record each at-bat result with RBIs, runs scored, and hit location. After 3 outs, inning advances to Top of 2nd.
          </li>
          <li>
            <strong>Continue alternating</strong> between Opponent Batting and Our Team Batting each half-inning. Add new opponent pitchers or batters as they enter the game.
          </li>
          <li>
            <strong>End the game</strong> when the final out is recorded. Tap <strong>End Game</strong> to mark it as final.
          </li>
          <li>
            <strong>Review</strong> the box score and spray chart after the game!
          </li>
        </ol>
      </Card>

      {/* Settings */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Settings</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Dark Mode</strong> &mdash; Toggle between light and dark themes from the Settings page. Dark mode is great for outdoor games with bright sunlight.
          </p>
          <p>
            <strong>Profile</strong> &mdash; View your email and display name. Your account is linked to your Google or email/password sign-in.
          </p>
          <p>
            <strong>Sign Out</strong> &mdash; Log out from your account.
          </p>
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Tips for Best Results</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>Set up your roster and lineup <em>before</em> the game starts so you can focus on scoring during play.</li>
          <li>Add opponent pitchers as they enter the game so each at-bat is linked to the correct pitcher for splits analysis.</li>
          <li>Use the spray chart tap on every batted ball &mdash; even outs. Over a season, this reveals valuable hitting tendencies.</li>
          <li>Record pitch locations during opponent at-bats to analyze your pitcher&apos;s tendencies and strike zone command.</li>
          <li>Check the Stats Search page regularly to see how your team performs against different opponents and pitcher types.</li>
          <li>Use the <strong>Undo Last</strong> button right away if you record something incorrectly &mdash; it&apos;s easier to fix in the moment.</li>
          <li>Have a second person help &mdash; one person watches the game, the other records on the app.</li>
          <li>Use dark mode at outdoor games for better screen visibility in bright sunlight.</li>
        </ul>
      </Card>
    </div>
  );
}
