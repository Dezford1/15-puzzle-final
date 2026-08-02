<?php

require "db.php";

header("Content-Type: application/json");

// Get the top 10 scores
$sql = "
SELECT
    player_name,
    theme,
    moves,
    completion_time,
    completed_at
FROM leaderboard
ORDER BY
    moves ASC,
    completion_time ASC
LIMIT 10
";

$result = $conn->query($sql);

$scores = [];

if ($result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {

        $scores[] = [
            "player_name" => $row["player_name"],
            "theme" => $row["theme"],
            "moves" => (int)$row["moves"],
            "completion_time" => (int)$row["completion_time"],
            "completed_at" => $row["completed_at"]
        ];

    }

}

// Return JSON
echo json_encode($scores);

$conn->close();

?>