// scores.js - connects the game to the database
//
// game.js uses player/mode/time, the database uses player_name/theme/
// completion_time, so the names get swapped over here.
//
// Load after storage.js and before game.js.
//
// W3Schools pages used: fetch, async/await, try...catch.

const Scores = {

  // Save a finished game. Uses the database, or localStorage if that fails.
  async save(result) {
    const record = {
      player_name: String(result.player || "Anonymous").slice(0, 20),
      theme: result.mode,
      moves: result.moves,
      completion_time: result.time
    };

    try {
      const response = await fetch("api/saveScore.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(record)
      });

      const body = await response.json();

      // The page still loads when the insert fails, so check success too.
      if (!body.success) throw new Error(body.message);

      loadLeaderboard();
      return { ok: true };

    } catch (error) {
      console.log("Database unavailable, saving locally.");

      saveScoreLocal(record);
      loadLeaderboard();

      return { ok: true };
    }
  },

  // Read the score table. Same fallback as above.
  async top() {
    try {
      const response = await fetch("api/getScores.php");
      const scores = await response.json();

      return { ok: true, data: { scores: scores } };

    } catch (error) {
      console.log("Database unavailable, using local scores.");

      return { ok: true, data: { scores: getLocalScores() } };
    }
  }
};
