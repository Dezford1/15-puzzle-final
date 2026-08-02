<?php
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Leaderboard Test</title>

    <style>

        body{

            font-family: Arial, sans-serif;
            max-width:600px;
            margin:50px auto;

        }

        form{

            display:flex;
            flex-direction:column;
            gap:15px;

        }

        input,
        select,
        button{

            padding:10px;
            font-size:16px;

        }

    </style>

</head>

<body>

<h1>Save Leaderboard Score</h1>

<form action="api/saveScore.php" method="POST">

    <label>Player Name</label>

    <input
        type="text"
        name="player_name"
        value="Anonymous"
        required>

    <label>Theme</label>

    <select name="theme">

        <option>Tide</option>

        <option>Breeze</option>

        <option>Sun</option>

    </select>

    <label>Moves</label>

    <input
        type="number"
        name="moves"
        value="50"
        required>

    <label>Completion Time (seconds)</label>

    <input
        type="number"
        name="completion_time"
        value="90"
        required>

    <button type="submit">

        Save Score

    </button>

</form>

</body>

</html>