<?php
// Database connection.
//
// We each run a different MySQL setup, so these settings can be overridden
// by creating api/db.local.php with your own $host/$user/$pass/$db. That
// file is in .gitignore so it never gets committed.
//
// Run sql/schema.sql first to create the database and table.

$host = "localhost";
$user = "dforddowling1";
$pass = "dforddowling1";
$db   = "dforddowling1";

if (file_exists(__DIR__ . "/db.local.php")) {
    require __DIR__ . "/db.local.php";
}

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>