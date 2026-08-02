/* scores.mock.js — TEMPORARY STAND-IN
 *
 * Person B replaces this entire file with js/scores.js, which talks to
 * api/save_score.php and api/get_scores.php and falls back to localStorage
 * when MySQL is unavailable.
 *
 * Person A: do not edit this beyond logging. It exists so you can build and
 * test the game before the backend is ready. The two function signatures
 * below ARE the contract you both agreed to — they must not change.
 */

const Scores = {
  // -> Promise<{ ok: true, data: { id } } | { ok: false, error: string }>
  save(record) {
    console.log('[mock] Scores.save', record);
    return Promise.resolve({ ok: true, data: { id: 1 } });
  },

  // -> Promise<{ ok: true, data: { scores: [...] } } | { ok: false, error }>
  top(mode, limit = 10) {
    console.log('[mock] Scores.top', mode, limit);
    return Promise.resolve({
      ok: true,
      data: {
        scores: [
          { player: 'Demo', mode: 'numbers', moves: 84, time: 121, difficulty: 'normal' }
        ]
      }
    });
  }
};
