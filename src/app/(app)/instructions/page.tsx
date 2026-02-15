"use client";

import Card from "@/components/ui/Card";

export default function InstructionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">How to Use Diamond Stats</h1>

      {/* Getting Started */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Getting Started</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            <strong>Create a Team</strong> &mdash; From the Dashboard, tap{" "}
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">+ New Team</span>{" "}
            and enter your team name and level (Little League, Travel, High School, etc.).
          </li>
          <li>
            <strong>Add Players</strong> &mdash; Open your team page and add each player with their name, jersey number, batting hand, throwing hand, and primary position.
          </li>
          <li>
            <strong>Create a Season</strong> &mdash; Add a season to group your games and track stats over time.
          </li>
          <li>
            <strong>Schedule a Game</strong> &mdash; Tap <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">New Game</span>, enter the opponent, date, location, and whether you are home or away.
          </li>
        </ol>
      </Card>

      {/* Live Scoring */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Live Scoring</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          The Live Scoring page is the primary screen you use at the field. Open a game and tap <strong>Live Score</strong> to begin.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Setting Your Lineup</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Before scoring, set your batting order by tapping <strong>Set Lineup</strong>. Drag players up/down to set the order and assign each player a position for this game.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Scoring Mode Toggle</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Use the toggle at the top to switch between <strong>Our Team Batting</strong> (blue) and <strong>Opponent Batting</strong> (red). This determines whose at-bats you are recording.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Recording an At-Bat</h3>
        <ol className="mb-3 list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>The current batter is shown automatically (cycles through the lineup).</li>
          <li>Select the at-bat result from the buttons below.</li>
          <li>Adjust RBI count, mark if the runner scored, and record stolen bases or caught stealing.</li>
          <li>For batted balls, tap the spray chart diamond to record where the ball was hit.</li>
          <li>Tap <strong>Record At-Bat</strong> to save. The app automatically tracks outs, innings, and score.</li>
        </ol>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Tap a Different Batter</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Need to record an at-bat for someone out of order? Tap any player in the batting order list to select them. Tap again or use &ldquo;Back to next up&rdquo; to return to the automatic rotation.
        </p>
      </Card>

      {/* At-Bat Result Buttons */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">At-Bat Result Buttons</h2>

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
              <div><strong>SF</strong> &mdash; Sacrifice Fly (1 out, not an official AB)</div>
              <div><strong>SAC</strong> &mdash; Sacrifice Bunt (1 out, not an official AB)</div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-semibold text-yellow-600 dark:text-yellow-400">Other</h3>
            <div className="text-gray-700 dark:text-gray-300">
              <div><strong>E</strong> &mdash; Error (batter reaches on a fielding error)</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Opponent Tracking */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Opponent Tracking</h2>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Opponent Batters</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          Switch to <strong>Opponent Batting</strong> mode to track the opposing team&apos;s at-bats. Add their batters with name, jersey number, and batting hand. Their at-bats are recorded the same way as your team&apos;s, and the score updates automatically for the correct side.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Opponent Pitchers</h3>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          When your team is batting, select the opposing pitcher from the dropdown (or add a new one). Record whether they throw left or right-handed. This enables pitcher-specific stat splits later.
        </p>

        <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Pitch Tracking</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          When in opponent batting mode, use the pitch tracking panel to record each pitch before logging the at-bat result. Tap the strike zone diagram to record pitch location, select the pitch result (Called Strike, Swinging Strike, Foul, Ball, In Play, or HBP), then tap <strong>+ Add Pitch</strong>. The ball-strike count updates automatically. Foul balls do not add a strike when already at 2 strikes.
        </p>
      </Card>

      {/* Spray Charts */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Spray Charts</h2>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          When recording a batted-ball result (hit or out in play), a baseball diamond appears. Tap where the ball landed or was fielded. The location is saved with the at-bat.
        </p>
        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
          View spray charts for individual players or the whole team from the team page. Hits are color-coded:
        </p>
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

      {/* Stats Explained */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">How Stats Are Calculated</h2>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
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
          <div>
            <h3 className="font-semibold">Plate Appearances (PA)</h3>
            <p>Total times a batter comes to the plate, including walks, HBP, sacrifices, and all other outcomes.</p>
          </div>
          <div>
            <h3 className="font-semibold">At-Bats (AB)</h3>
            <p>Plate appearances minus walks, HBP, sacrifice flies, sacrifice bunts, and catcher&apos;s interference. This is the denominator for batting average.</p>
          </div>
        </div>
      </Card>

      {/* Stats Search */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Advanced Stats Search</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Use the <strong>Stats Search</strong> page to filter stats by opponent team, opponent pitcher, pitcher handedness (Left/Right), date range, and season. This lets you see how your players perform against specific opponents or left-handed vs. right-handed pitching.
        </p>
      </Card>

      {/* Game Management */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Game Management</h2>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Undo Last</strong> &mdash; Removes the most recent at-bat and reverts the score, outs, and inning if needed.
          </p>
          <p>
            <strong>End Game</strong> &mdash; Marks the game as final. The final score is locked and the game appears in your completed games list.
          </p>
          <p>
            <strong>Box Score</strong> &mdash; View a traditional box score with line score, batting stats, and pitching stats for the game.
          </p>
          <p>
            <strong>Inning Tracking</strong> &mdash; Innings, outs, and top/bottom half advance automatically based on the at-bat results you record. Three outs ends the half-inning.
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
          <li>Use dark mode at outdoor games for better screen visibility in bright sunlight.</li>
        </ul>
      </Card>
    </div>
  );
}
