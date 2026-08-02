/* game.js — Person A
 *
 * Everything the player touches: rendering, input, timer, move counter.
 * All board logic lives in puzzle.js — this file only asks it to move.
 *
 * Techniques used here, with W3Schools reference pages:
 *   addEventListener      https://www.w3schools.com/jsref/met_document_addeventlistener.asp
 *   setInterval           https://www.w3schools.com/jsref/met_win_setinterval.asp
 *   createElement         https://www.w3schools.com/jsref/met_document_createelement.asp
 *   dataset (data-*)      https://www.w3schools.com/jsref/prop_html_dataset.asp
 *   keydown / event.key   https://www.w3schools.com/jsref/event_key_key.asp
 *   Promises              https://www.w3schools.com/js/js_promise.asp
 */

const CONFIG = {
  difficulty:   'normal',
  magicUses:    3,
  shuffleMoves: 240
};

const el = {
  board:     document.getElementById('board'),
  mode:      document.getElementById('mode'),
  shuffle:   document.getElementById('shuffle'),
  reset:     document.getElementById('reset'),
  magic:     document.getElementById('magic'),
  magicLeft: document.getElementById('magic-left'),
  moves:     document.getElementById('moves'),
  time:      document.getElementById('time'),
  status:    document.getElementById('status')
};

let moves      = 0;
let magicLeft  = CONFIG.magicUses;
let openingBoard = null;  // snapshot of the shuffle, so Reset can replay it
let startTime  = null;    // null until the first move
let tickHandle = null;
let finished   = false;

// ---- rendering ---------------------------------------------------------
// Rebuilt from the array every time. Render stays a pure function of state,
// so the screen can never disagree with the board.
function render() {
  const board = Puzzle.getBoard();
  el.board.innerHTML = '';

  board.forEach((tile, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.dataset.index = index;

    if (tile === 0) {
      cell.className = 'tile blank';
      cell.setAttribute('aria-label', 'Empty square');
      cell.disabled = true;
    } else {
      const home = index === Puzzle.homeIndexOf(tile);
      cell.className = 'tile' + (home ? ' home' : '');
      cell.textContent = tile;
      cell.setAttribute('aria-label', `Tile ${tile}`);

      // For image modes: show the slice of the picture this tile owns.
      // Person B supplies the actual image via CSS background-image.
      const h = Puzzle.homeIndexOf(tile);
      const pct = 100 / (Puzzle.N - 1);
      cell.style.backgroundPosition =
        `${Puzzle.colOf(h) * pct}% ${Puzzle.rowOf(h) * pct}%`;
    }

    el.board.appendChild(cell);
  });

  el.moves.textContent = moves;
  el.magicLeft.textContent = magicLeft;
  el.magic.disabled = magicLeft === 0 || finished;
}

// ---- the single funnel for every move ----------------------------------
// Clicks, keys, and drags all end up here. One place to count moves,
// one place to check for a win.
function attemptMove(index) {
  if (finished) return;
  if (!Puzzle.moveBlankTo(index)) return;   // illegal move, ignore silently

  moves++;
  startTimer();
  render();
  checkWin();
}

function checkWin() {
  if (!Puzzle.isSolved()) return;
  finished = true;
  stopTimer();
  el.status.textContent = `Solved in ${moves} moves!`;

  // The only call into Person B's code. Contract:
  //   Scores.save({player, mode, moves, time, difficulty}) -> Promise<{ok}>
  Scores.save({
    player:     window.prompt('Your name for the leaderboard:') || 'Anonymous',
    mode:       el.mode.value,
    moves:      moves,
    time:       elapsedSeconds(),
    difficulty: CONFIG.difficulty
  });
}

// ---- timer -------------------------------------------------------------
const elapsedSeconds = () =>
  startTime === null ? 0 : Math.floor((Date.now() - startTime) / 1000);

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Starts on the first real move, not on page load.
function startTimer() {
  if (startTime !== null) return;
  startTime = Date.now();
  tickHandle = setInterval(() => {
    el.time.textContent = formatTime(elapsedSeconds());
  }, 250);
}

function stopTimer() {
  clearInterval(tickHandle);
  tickHandle = null;
}

function resetTimer() {
  stopTimer();
  startTime = null;
  el.time.textContent = '0:00';
}

// ---- input -------------------------------------------------------------
// Click a square to move the blank there.
el.board.addEventListener('click', e => {
  const cell = e.target.closest('.tile');
  if (cell) attemptMove(Number(cell.dataset.index));
});

// Hold and drag: the blank follows the cursor. Bonus layer only —
// clicking and arrow keys must keep working for accessibility.
let dragging = false;
el.board.addEventListener('mousedown', () => { dragging = true; });
document.addEventListener('mouseup',   () => { dragging = false; });
el.board.addEventListener('mouseover', e => {
  if (!dragging) return;
  const cell = e.target.closest('.tile');
  if (cell) attemptMove(Number(cell.dataset.index));
});

// Arrow keys drive the BLANK, not the tiles.
// Right arrow = the empty square moves right, tile there slides left.
document.addEventListener('keydown', e => {
  const delta = {
    ArrowUp:    -Puzzle.N,
    ArrowDown:   Puzzle.N,
    ArrowLeft:  -1,
    ArrowRight:  1
  }[e.key];
  if (delta === undefined) return;
  e.preventDefault();

  const target = Puzzle.blankIndex() + delta;
  // moveBlankTo rejects wrap-around (e.g. right edge -> next row) for us.
  attemptMove(target);
});

// ---- buttons -----------------------------------------------------------
// Shuffle = a brand new puzzle. Reset = another attempt at the same one,
// so a player can compare their move count on identical starting tiles.
el.shuffle.addEventListener('click', newGame);

el.reset.addEventListener('click', () => {
  if (!openingBoard) return;
  Puzzle.setBoard(openingBoard);
  clearStats();
  render();
});

el.magic.addEventListener('click', () => {
  if (finished || magicLeft === 0) return;
  if (!Puzzle.magic()) return;
  magicLeft--;
  render();
  checkWin();
});

el.mode.addEventListener('change', () => {
  el.board.className = 'board mode-' + el.mode.value;
});

// ---- lifecycle ---------------------------------------------------------
function clearStats() {
  moves     = 0;
  magicLeft = CONFIG.magicUses;
  finished  = false;
  el.status.textContent = '';
  resetTimer();
}

function newGame() {
  Puzzle.shuffle(CONFIG.shuffleMoves);
  openingBoard = Puzzle.getBoard();   // remember it so Reset can restore it
  clearStats();
  render();
}

newGame();
