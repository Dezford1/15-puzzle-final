// game.js - the page side of the puzzle
//
// Handles drawing the tiles, the buttons, the timer and the move counter.
// All the board rules are in puzzle.js.
//
// W3Schools pages used: addEventListener, setInterval, createElement,
// dataset, event.key.

const MAGIC_USES = 3;
const SHUFFLE_MOVES = 240;
const DIFFICULTY = "normal";

const boardEl = document.getElementById("board");
const modeEl = document.getElementById("mode");
const shuffleEl = document.getElementById("shuffle");
const resetEl = document.getElementById("reset");
const magicEl = document.getElementById("magic");
const magicLeftEl = document.getElementById("magic-left");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");

let moves = 0;
let magicLeft = MAGIC_USES;
let startTime = null;
let timer = null;
let finished = false;
let openingBoard = null;

// Draw all 16 squares from the array.
function render() {
  const board = Puzzle.getBoard();

  boardEl.innerHTML = "";

  for (let i = 0; i < board.length; i++) {
    const tile = board[i];
    const cell = document.createElement("button");

    cell.type = "button";
    cell.dataset.index = i;

    if (tile === 0) {
      cell.className = "tile blank";
      cell.disabled = true;
      cell.setAttribute("aria-label", "Empty square");
    } else {
      cell.className = "tile";
      cell.textContent = tile;
      cell.setAttribute("aria-label", "Tile " + tile);

      if (i === Puzzle.homeIndexOf(tile)) {
        cell.className = "tile home";
      }

      // Each tile shows its own part of the theme picture.
      const home = Puzzle.homeIndexOf(tile);
      const step = 100 / (Puzzle.N - 1);
      cell.style.backgroundPosition =
        Puzzle.colOf(home) * step + "% " + Puzzle.rowOf(home) * step + "%";
    }

    boardEl.appendChild(cell);
  }

  movesEl.textContent = moves;
  magicLeftEl.textContent = magicLeft;
  magicEl.disabled = magicLeft === 0 || finished;
}

// Clicks, arrow keys and dragging all come through here.
function attemptMove(index) {
  if (finished) return;
  if (!Puzzle.moveBlankTo(index)) return;

  moves++;
  startTimer();
  render();
  checkWin();
}

function checkWin() {
  if (!Puzzle.isSolved()) return;

  finished = true;
  stopTimer();
  statusEl.textContent = "Solved in " + moves + " moves!";

  const name = window.prompt("Your name for the leaderboard:");

  Scores.save({
    player: name || "Anonymous",
    mode: modeEl.value,
    moves: moves,
    time: elapsedSeconds(),
    difficulty: DIFFICULTY
  });
}

// ---- timer ----

function elapsedSeconds() {
  if (startTime === null) return 0;

  return Math.floor((Date.now() - startTime) / 1000);
}

function formatTime(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  return minutes + ":" + String(seconds).padStart(2, "0");
}

// Starts on the first move, not when the page loads.
function startTimer() {
  if (startTime !== null) return;

  startTime = Date.now();

  timer = setInterval(function () {
    timeEl.textContent = formatTime(elapsedSeconds());
  }, 250);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  stopTimer();
  startTime = null;
  timeEl.textContent = "0:00";
}

// ---- input ----

boardEl.addEventListener("click", function (e) {
  const cell = e.target.closest(".tile");
  if (cell) attemptMove(Number(cell.dataset.index));
});

// Hold the mouse down and drag to slide several tiles in a row.
let dragging = false;

boardEl.addEventListener("mousedown", function () {
  dragging = true;
});

document.addEventListener("mouseup", function () {
  dragging = false;
});

boardEl.addEventListener("mouseover", function (e) {
  if (!dragging) return;

  const cell = e.target.closest(".tile");
  if (cell) attemptMove(Number(cell.dataset.index));
});

// Arrow keys move the empty space, so pressing right moves it right.
document.addEventListener("keydown", function (e) {
  let delta;

  if (e.key === "ArrowUp") delta = -Puzzle.N;
  else if (e.key === "ArrowDown") delta = Puzzle.N;
  else if (e.key === "ArrowLeft") delta = -1;
  else if (e.key === "ArrowRight") delta = 1;
  else return;

  e.preventDefault();
  attemptMove(Puzzle.blankIndex() + delta);
});

// ---- buttons ----

// Shuffle gives a new puzzle, Reset gives another go at the same one.
shuffleEl.addEventListener("click", newGame);

resetEl.addEventListener("click", function () {
  if (!openingBoard) return;

  Puzzle.setBoard(openingBoard);
  clearStats();
  render();
});

magicEl.addEventListener("click", function () {
  if (finished || magicLeft === 0) return;
  if (!Puzzle.magic()) return;

  magicLeft--;
  render();
  checkWin();
});

modeEl.addEventListener("change", function () {
  boardEl.className = "board mode-" + modeEl.value;
});

// ---- start ----

function clearStats() {
  moves = 0;
  magicLeft = MAGIC_USES;
  finished = false;
  statusEl.textContent = "";
  resetTimer();
}

function newGame() {
  Puzzle.shuffle(SHUFFLE_MOVES);
  openingBoard = Puzzle.getBoard();
  clearStats();
  render();
}

newGame();
