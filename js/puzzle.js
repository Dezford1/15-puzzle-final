/* puzzle.js — Person A
 *
 * Pure game state. No DOM, no fetch, no timers in here.
 * Keeping it pure means game.js can't corrupt the board, and you can
 * test any function straight from the browser console:
 *
 *     Puzzle.getBoard()
 *     Puzzle.moveBlank(1)     // slide blank right one column
 *     Puzzle.isSolved()
 *
 * Techniques used here, with W3Schools reference pages:
 *   Arrays                https://www.w3schools.com/js/js_arrays.asp
 *   indexOf               https://www.w3schools.com/jsref/jsref_indexof_array.asp
 *   every                 https://www.w3schools.com/jsref/jsref_every.asp
 *   Math.random / floor   https://www.w3schools.com/js/js_random.asp
 *   Arrow functions       https://www.w3schools.com/js/js_arrow_function.asp
 */

const Puzzle = (function () {
  const N = 4;                 // 4x4 grid
  const CELLS = N * N;         // 16 squares

  // The goal state. 0 represents the empty square.
  const SOLVED = Array.from({ length: CELLS - 1 }, (_, i) => i + 1).concat(0);

  // board[index] = tile number sitting at that index. 0 = the blank.
  // Index 0 is top-left, index 15 is bottom-right.
  let board = SOLVED.slice();

  // ---- geometry -------------------------------------------------------
  // Flat index -> row/column. This is why a flat array beats a 2D one:
  // the math is two operations and the win check is one line.
  const rowOf = i => Math.floor(i / N);
  const colOf = i => i % N;

  function isAdjacent(a, b) {
    const sameRow = rowOf(a) === rowOf(b) && Math.abs(colOf(a) - colOf(b)) === 1;
    const sameCol = colOf(a) === colOf(b) && Math.abs(rowOf(a) - rowOf(b)) === 1;
    return sameRow || sameCol;
  }

  const blankIndex = () => board.indexOf(0);

  // Every index the blank could legally swap into right now (2, 3, or 4 of them).
  function legalTargets() {
    const b = blankIndex();
    const out = [];
    if (rowOf(b) > 0)     out.push(b - N);   // up
    if (rowOf(b) < N - 1) out.push(b + N);   // down
    if (colOf(b) > 0)     out.push(b - 1);   // left
    if (colOf(b) < N - 1) out.push(b + 1);   // right
    return out;
  }

  // ---- moves ----------------------------------------------------------
  // The ONE rule of the whole game: swap the blank with an adjacent square.
  // Returns true if the move was legal and happened.
  function moveBlankTo(index) {
    if (index < 0 || index >= CELLS) return false;
    const b = blankIndex();
    if (!isAdjacent(index, b)) return false;
    [board[b], board[index]] = [board[index], board[b]];
    return true;
  }

  function isSolved() {
    return board.every((tile, i) => tile === SOLVED[i]);
  }

  // ---- shuffle ---------------------------------------------------------
  // Scramble the board so it is ALWAYS solvable.
  //
  // Deliberately NOT a random shuffle of the array. Exactly half of the 16!
  // possible arrangements can never be solved, so shuffling directly would
  // hand the player an impossible board about half the time.
  //
  // Instead we start from the solved board and walk away from it using only
  // moves the player is allowed to make. Anything reachable that way is
  // reachable back, so the result is solvable by construction. This is why
  // the spec specifies "Shuffle Moves: 240".
  function shuffle(steps = 240) {
    board = SOLVED.slice();

    // Where the blank sat one step ago. Without this the walk keeps
    // undoing itself — left, right, left, right — and barely scrambles.
    let previous = -1;

    for (let step = 0; step < steps; step++) {
      const from = blankIndex();

      let options = legalTargets().filter(i => i !== previous);
      // A corner has only 2 exits; if one was the way back, take what's left.
      if (options.length === 0) options = legalTargets();

      const target = options[Math.floor(Math.random() * options.length)];
      previous = from;
      moveBlankTo(target);
    }

    // Astronomically unlikely at 240 steps, but a shuffle that hands back
    // the solved board is still a bug.
    if (isSolved()) shuffle(steps);
  }

  // ---- TODO #2: magic --------------------------------------------------
  // The assist. Limited to 3 uses (see CONFIG in game.js).
  //
  // Simplest version that satisfies "difficulty-aware assist":
  //   - find the lowest-numbered tile that is NOT in its home square
  //   - swap it with whatever tile is currently sitting in its home square
  //   - return true if something was fixed, false if already solved
  //
  // Note this is a teleport, not a slide, so it deliberately ignores
  // isAdjacent. That is exactly why it's capped at 3 uses.
  //
  // Tile n belongs at index n - 1.
  function magic() {
    // TODO: implement
    return false;
  }

  // Restore a previously captured arrangement (used by the Reset button,
  // so the player can retry the same puzzle instead of a brand new one).
  // Validated, because silently accepting a malformed array would produce
  // a board that looks fine but can never be solved.
  function setBoard(arrangement) {
    if (!Array.isArray(arrangement) || arrangement.length !== CELLS) return false;
    const sorted = [...arrangement].sort((a, b) => a - b);
    if (!sorted.every((v, i) => v === i)) return false;   // must be exactly 0-15
    board = arrangement.slice();
    return true;
  }

  // ---- public API ------------------------------------------------------
  return {
    N,
    CELLS,
    getBoard: () => board.slice(),   // copy, so callers can't mutate our state
    setBoard,
    blankIndex,
    legalTargets,
    isAdjacent,
    moveBlankTo,
    isSolved,
    shuffle,
    magic,
    rowOf,
    colOf,
    homeIndexOf: tile => tile - 1
  };
})();
