# Fifteen Puzzle — Project 2

Course project. Track: **Undergrad**. Difficulty: normal, Magic Uses: 3, Shuffle Moves: 240.

## Running it

Copy this folder into XAMPP's `htdocs`, then open:

    http://localhost/15-puzzle-project/

`index.php` must be served by PHP — double-clicking it will not work.

## Structure

    index.php               page shell
    css/style.css           layout, themes, responsive rules
    js/puzzle.js            board state and move rules (no DOM)
    js/game.js              rendering, input, timer, move counter
    js/scores.mock.js       temporary fake backend (delete once scores.js exists)
    api/db.php              MySQL connection + config flag
    api/save_score.php      writes a score record
    api/get_scores.php      returns ranked scores
    sql/schema.sql          table definition
    assets/themes/          tile images for the two image modes
    reference/              scratch demo, not part of the submission

## Who owns what

| Person A — game engine | Person B — data & presentation |
|---|---|
| `index.php` | `css/style.css` |
| `js/puzzle.js` | `js/scores.js` |
| `js/game.js` | `api/*`, `sql/schema.sql`, `assets/themes/` |

Nobody edits the other column. Prevents merge conflicts and keeps the
reflection write-up honest about who did what.

## The contract between us

`game.js` calls exactly two functions and nothing else. These signatures
are fixed — changing one means changing both sides.

```js
Scores.save({ player, mode, moves, time, difficulty })  // -> Promise
Scores.top(mode, limit)                                 // -> Promise
```

Every `api/` response uses the same envelope, success or failure:

```json
{ "ok": true,  "data": { "scores": [ ... ] } }
{ "ok": false, "error": "invalid player name" }
```

`time` is **an integer number of seconds**, not a formatted string. The
localStorage fallback must store records in this identical shape, or the
leaderboard will render differently depending on whether MySQL is up.

## Outstanding work

**Person A** — two `TODO`s in `js/puzzle.js`:
1. `shuffle()` — 240 random *legal* moves from solved. Do not shuffle the
   array directly; half of all arrangements are unsolvable.
2. `magic()` — teleport the lowest out-of-place tile to its home square.

**Person B** — everything in the right-hand column above, plus the
localStorage fallback path when `api/db.php` cannot connect.

## Checkpoints

1. Board slides + endpoints return fake rows → confirm the JSON shape matches.
2. Real MySQL write works → break the credentials on purpose and confirm
   the fallback still saves.
3. Review each other's files, check naming and organization, cross-check
   against the Project 2 Q&A and the grading rubric.
