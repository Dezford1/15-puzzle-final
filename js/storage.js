// Local Storage Fallback Functions

const STORAGE_KEY = "beachPuzzleLeaderboard";

/**
 * Save a score locally.
 */
function saveScoreLocal(score) {
  let scores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  scores.push(score);

  scores.sort((a, b) => {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }

    return a.completion_time - b.completion_time;
  });

  scores = scores.slice(0, 10);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

/**
 * Load local scores.
 */
function getLocalScores() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
