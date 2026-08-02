<?php
$host = "localhost";
$user = "dforddowling1";
$pass = "dforddowling1";
$db   = "dforddowling1";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>