<?php

require "db.php";

header("Content-Type: application/json");

// Response array
$response = [
    "success" => false,
    "message" => ""
];

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Get values from the request
    $player = $_POST["player_name"] ?? "Anonymous";
    $theme = $_POST["theme"] ?? "Tide";
    $moves = $_POST["moves"] ?? 0;
    $time = $_POST["completion_time"] ?? 0;

    // Prepare SQL statement
    $stmt = $conn->prepare(
        "INSERT INTO leaderboard
        (player_name, theme, moves, completion_time)
        VALUES (?, ?, ?, ?)"
    );

    // Bind parameters
    $stmt->bind_param(
        "ssii",
        $player,
        $theme,
        $moves,
        $time
    );

    // Execute query
    if ($stmt->execute()) {

        $response["success"] = true;
        $response["message"] = "Score saved successfully!";

    } else {

        $response["message"] = "Error: " . $stmt->error;

    }

    $stmt->close();

} else {

    $response["message"] = "Invalid request.";

}

$conn->close();

// Return JSON
echo json_encode($response);

?>