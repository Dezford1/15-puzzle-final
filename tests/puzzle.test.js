/* tests/puzzle.test.js — Person A
 *
 * Plain Node test harness for the game logic. No framework, no install.
 * Run it from the project root:
 *
 *     node tests/puzzle.test.js
 *
 * Rerun this every time you change puzzle.js. The last three tests fail
 * until you implement shuffle() and magic() — that is expected, and they
 * are exactly the checks your implementation has to satisfy.
 */

const fs = require('fs');
const path = require('path');

// puzzle.js is a browser file with no module exports, so load it by
// evaluating the source and handing back the Puzzle object it defines.
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'puzzle.js'), 'utf8');
const Puzzle = new Function(src + '; return Puzzle;')();

let passed = 0, failed = 0;

function check(name, condition) {
  if (condition) { passed++; console.log(`  PASS  ${name}`); }
  else           { failed++; console.log(`  FAIL  ${name}`); }
}

const SOLVED = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
const eq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

console.log('\nGeometry');
check('index 0 is row 0, col 0',        Puzzle.rowOf(0) === 0 && Puzzle.colOf(0) === 0);
check('index 15 is row 3, col 3',       Puzzle.rowOf(15) === 3 && Puzzle.colOf(15) === 3);
check('4 and 5 are adjacent',           Puzzle.isAdjacent(4, 5));
check('3 and 4 are NOT adjacent',       !Puzzle.isAdjacent(3, 4));  // row wrap
check('4 and 8 are adjacent',           Puzzle.isAdjacent(4, 8));   // vertical

console.log('\nStarting state');
check('board starts solved',            eq(Puzzle.getBoard(), SOLVED));
check('blank starts at index 15',       Puzzle.blankIndex() === 15);
check('corner has 2 legal moves',       Puzzle.legalTargets().length === 2);

console.log('\nMoves');
check('legal move succeeds',            Puzzle.moveBlankTo(14) === true);
check('board updated after move',       Puzzle.getBoard()[15] === 15);
check('illegal move rejected',          Puzzle.moveBlankTo(0) === false);
check('board unchanged after illegal',  Puzzle.getBoard()[15] === 15);
check('off-board index rejected',       Puzzle.moveBlankTo(99) === false);
Puzzle.moveBlankTo(15);  // undo
check('back to solved after undo',      Puzzle.isSolved());

console.log('\nEncapsulation');
const copy = Puzzle.getBoard();
copy[0] = 999;
check('getBoard returns a copy',        Puzzle.getBoard()[0] === 1);

console.log('\nTODO #1 — shuffle()');
Puzzle.shuffle(240);
const shuffled = Puzzle.getBoard();
check('board is no longer solved',      !Puzzle.isSolved());
check('still contains 0-15 exactly once',
  [...shuffled].sort((a, b) => a - b).every((v, i) => v === i));
check('board is solvable',              isSolvable(shuffled));

console.log('\nTODO #2 — magic()');
const before = Puzzle.getBoard().filter((t, i) => t !== 0 && t === i + 1).length;
const used = Puzzle.magic();
const after = Puzzle.getBoard().filter((t, i) => t !== 0 && t === i + 1).length;
check('magic() reports it did something', used === true);
check('at least one more tile is home',  after > before);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);

// Independent solvability check, so the test does not just trust the
// shuffle. On an EVEN-width board (ours is 4 wide), the board is solvable
// when (inversions + row of the blank counted from the bottom, 1-indexed)
// is ODD. Sanity check: the solved board has 0 inversions and its blank
// sits in the bottom row, so 0 + 1 = 1, odd, solvable. Swapping just 14
// and 15 gives 1 + 1 = 2, even — the classic unsolvable board.
function isSolvable(board) {
  const tiles = board.filter(t => t !== 0);
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++)
    for (let j = i + 1; j < tiles.length; j++)
      if (tiles[i] > tiles[j]) inversions++;
  const blankRowFromBottom = 4 - Math.floor(board.indexOf(0) / 4);
  return (inversions + blankRowFromBottom) % 2 === 1;
}
