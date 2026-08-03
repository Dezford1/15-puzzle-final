-- Database setup for the Fifteen Puzzle leaderboard.
--
-- Run this once before using the app:
--   mysql -u root -p < sql/schema.sql
--
-- Columns match what api/saveScore.php inserts and api/getScores.php reads.

CREATE DATABASE IF NOT EXISTS puzzle_db;

USE puzzle_db;

CREATE TABLE IF NOT EXISTS leaderboard (
    id              INT AUTO_INCREMENT PRIMARY KEY,

    player_name     VARCHAR(20)  NOT NULL,
    theme           VARCHAR(20)  NOT NULL,
    moves           INT UNSIGNED NOT NULL,
    completion_time INT UNSIGNED NOT NULL,   -- whole seconds

    completed_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- getScores.php sorts by moves then time, so index both.
CREATE INDEX idx_ranking ON leaderboard (moves, completion_time);
