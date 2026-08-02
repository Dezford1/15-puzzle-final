<?php
// Main page for the Summer Beach Escape Fifteen Puzzle
?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Fifteen Puzzle</title>

    <link rel="stylesheet" href="css/style.css">
</head>

<body>

<header>
    <h1>🌴 Summer Beach Escape</h1>
    <p>15 Puzzle Challenge</p>
</header>

<main>

    <!--Instructions -->

    <section id="instructions">

        <h2>How to Play</h2>

        <p>
            Rearrange the shuffled tiles to recreate the complete Summer Beach image.
            Click any tile adjacent to the empty space to slide it into position.
            Complete the puzzle using the fewest moves and shortest amount of time.
            If you become stuck, use the Magic button for assistance.
        </p>

    </section>

    <!--Controls -->

    <section id="controls" aria-label="Game controls">

        <div class="control-group">

            <label for="mode">Theme</label>

            <select id="mode">

                <option value="tide">🌊 Tide</option>

                <option value="breeze">🌴 Breeze</option>

                <option value="sun">☀️ Sun</option>

            </select>

        </div>

        <div class="button-group">

            <button id="shuffle" type="button">
                Shuffle
            </button>

            <button id="reset" type="button">
                Reset
            </button>

            <button id="magic" type="button">
                Magic Hint (<span id="magic-left">3</span>)
            </button>

        </div>

    </section>

    <!-- Puzzle Board -->

    <section id="game">

        <div
            id="board"
            class="board mode-tide"
            role="grid"
            aria-label="Puzzle board">

            <!-- puzzle.js generates the tiles -->

        </div>

    </section>

    <!-- Statistics -->

    <section id="stats" aria-live="polite">

        <div class="stat-card">

            <h3>Moves</h3>

            <p id="moves">0</p>

        </div>

        <div class="stat-card">

            <h3>Time</h3>

            <p id="time">0:00</p>

        </div>

    </section>

    <!-- Game Status -->

    <section id="game-status">

        <p id="status" role="status"></p>

    </section>

    <!--Leaderboard -->

    <section id="leaderboard" aria-label="High scores">

    <h2>🏆 Leaderboard</h2>

    <table>

        <thead>

            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Theme</th>
                <th>Moves</th>
                <th>Time</th>
            </tr>

        </thead>

        <tbody id="leaderboard-body">

            <tr>
                <td colspan="5">Loading scores...</td>
            </tr>

        </tbody>

    </table>

</section>

</main>

<footer>

    <p>
        Created by Dezmond Ford-Dowling & Frank Eson
    </p>

</footer>

<!-- Scripts -->
<script src="js/storage.js"></script>
<script src="js/leaderboard.js"></script>

<!-- Bridges game.js to the API. After storage.js, before game.js. -->
<script src="js/scores.js"></script>

<script src="js/puzzle.js"></script>

<script src="js/game.js"></script>

</body>

</html>
