/* scores.js — the bridge between the game and the database.
 *
 * game.js knows nothing about PHP, and the PHP knows nothing about tiles.
 * This file is the only place the two vocabularies meet, so it is also the
 * only place that has to change if either side is renamed.
 *
 *   game.js speaks:   player      mode    moves   time
 *   the database:     player_name theme   moves   completion_time
 *
 * Load order matters: storage.js must come first (saveScoreLocal lives
 * there) and game.js must come after.
 *
 * Techniques used here, with W3Schools reference pages:
 *   fetch / POST      https://www.w3schools.com/js/js_api_fetch.asp
 *   async / await     https://www.w3schools.com/js/js_async.asp
 *   localStorage      https://www.w3schools.com/js/js_api_web_storage.asp
 *   try...catch       https://www.w3schools.com/js/js_errors.asp
 */

const Scores = {

  /* Save one finished game.
   * Tries MySQL first; falls back to localStorage if the server is down,
   * unreachable, or reports a failure. Either way the player's score is
   * kept, which is the behaviour the spec asks for.
   *
   * Returns { ok, data|error, storedLocally }
   */
  async save(result) {
    const record = toDatabaseShape(result);

    try {
      const response = await fetch('api/saveScore.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(record)
      });

      if (!response.ok) throw new Error('HTTP ' + response.status);

      const body = await response.json();

      // saveScore.php answers 200 with {success:false} when the INSERT
      // itself fails, so a successful request is not a successful save.
      if (!body.success) throw new Error(body.message || 'save rejected');

      refreshLeaderboard();
      return { ok: true, data: { storedLocally: false } };

    } catch (error) {
      console.warn('Database save failed, keeping score locally:', error.message);
      saveScoreLocal(record);
      refreshLeaderboard();
      return { ok: true, data: { storedLocally: true } };
    }
  },

  /* Read the ranked table. Same fallback path as save().
   * Returns { ok, data: { scores: [...] } }
   */
  async top(mode, limit = 10) {
    try {
      const response = await fetch('api/getScores.php');
      if (!response.ok) throw new Error('HTTP ' + response.status);

      const scores = await response.json();
      if (!Array.isArray(scores)) throw new Error('unexpected response shape');

      return { ok: true, data: { scores: scores.slice(0, limit) } };

    } catch (error) {
      console.warn('Database read failed, using local scores:', error.message);
      return { ok: true, data: { scores: getLocalScores().slice(0, limit) } };
    }
  }
};

/* Translate a game result into the column names the table uses, and clean
 * the one field that came from a human. The player name reaches the page
 * again through innerHTML, so anything that looks like markup is stripped
 * here rather than trusted later.
 */
function toDatabaseShape(result) {
  const name = String(result.player ?? '')
    .replace(/[<>&"']/g, '')
    .trim()
    .slice(0, 20);

  return {
    player_name:     name || 'Anonymous',
    theme:           String(result.mode ?? 'tide'),
    moves:           Math.max(0, Math.floor(Number(result.moves) || 0)),
    completion_time: Math.max(0, Math.floor(Number(result.time) || 0))
  };
}

/* Redraw the table after a save so the new score appears without a reload.
 * leaderboard.js owns the rendering; we only ask it to run again.
 */
function refreshLeaderboard() {
  if (typeof loadLeaderboard === 'function') loadLeaderboard();
}
