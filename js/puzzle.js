// puzzle.js - the board and the rules
//
// The board is one array of 16 numbers. 0 is the empty square.
// Index 0 is top left, index 15 is bottom right.
//
// W3Schools pages used: Arrays, indexOf, Math.random, arrow functions.

const Puzzle = (function () {
  const N = 4;
  const CELLS = 16;

  const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

  let board = SOLVED.slice();

  // Turn an index into a row and column.
  function rowOf(i) {
    return Math.floor(i / N);
  }

  function colOf(i) {
    return i % N;
  }

  // Two squares are next to each other if they share a row or a column
  // and are one step apart.
  function isAdjacent(a, b) {
    if (rowOf(a) === rowOf(b) && Math.abs(colOf(a) - colOf(b)) === 1) {
      return true;
    }

    if (colOf(a) === colOf(b) && Math.abs(rowOf(a) - rowOf(b)) === 1) {
      return true;
    }

    return false;
  }

  function blankIndex() {
    return board.indexOf(0);
  }

  // All the squares the empty space can move to right now.
  function legalTargets() {
    const b = blankIndex();
    const targets = [];

    if (rowOf(b) > 0) targets.push(b - N);
    if (rowOf(b) < N - 1) targets.push(b + N);
    if (colOf(b) > 0) targets.push(b - 1);
    if (colOf(b) < N - 1) targets.push(b + 1);

    return targets;
  }

  // The only move in the game: swap the empty space with a neighbour.
  function moveBlankTo(index) {
    if (index < 0 || index >= CELLS) return false;

    const b = blankIndex();
    if (!isAdjacent(index, b)) return false;

    board[b] = board[index];
    board[index] = 0;

    return true;
  }

  function isSolved() {
    for (let i = 0; i < CELLS; i++) {
      if (board[i] !== SOLVED[i]) return false;
    }

    return true;
  }

  // Used by the Reset button to put back an earlier arrangement.
  function setBoard(arrangement) {
    if (!Array.isArray(arrangement) || arrangement.length !== CELLS) {
      return false;
    }

    board = arrangement.slice();
    return true;
  }

  // Scramble by making random legal moves from the solved board.
  //
  // Shuffling the array directly does not work - half of all the possible
  // arrangements of a 15 puzzle cannot be solved. Making real moves means
  // the player can always undo them, so the board is always solvable.
  //
  // previous stops the empty space from going straight back where it came
  // from, which would just undo the last move over and over.
  function shuffle(steps) {
    board = SOLVED.slice();

    let previous = -1;

    for (let i = 0; i < steps; i++) {
      const from = blankIndex();

      let options = legalTargets().filter(t => t !== previous);
      if (options.length === 0) options = legalTargets();

      const pick = options[Math.floor(Math.random() * options.length)];

      previous = from;
      moveBlankTo(pick);
    }

    if (isSolved()) shuffle(steps);
  }

  // The Magic button. Sends the lowest tile that is out of place back to
  // its home square, and whatever was there goes the other way.
  //
  // It has to fix two tiles, not one. Swapping a single pair of tiles turns
  // a solvable board into an unsolvable one, so a second swap is needed to
  // put that right.
  function magic() {
    if (!fixLowestTile()) return false;

    fixLowestTile();
    return true;
  }

  function fixLowestTile() {
    for (let tile = 1; tile < CELLS; tile++) {
      const home = tile - 1;

      if (board[home] === tile) continue;
      if (board[home] === 0) continue;

      const current = board.indexOf(tile);

      board[current] = board[home];
      board[home] = tile;

      return true;
    }

    return false;
  }

  return {
    N: N,
    CELLS: CELLS,
    getBoard: () => board.slice(),
    setBoard: setBoard,
    blankIndex: blankIndex,
    legalTargets: legalTargets,
    isAdjacent: isAdjacent,
    moveBlankTo: moveBlankTo,
    isSolved: isSolved,
    shuffle: shuffle,
    magic: magic,
    rowOf: rowOf,
    colOf: colOf,
    homeIndexOf: tile => tile - 1
  };
})();
