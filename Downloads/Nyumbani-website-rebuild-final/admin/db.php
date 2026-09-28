<?php
// Database settings. Defaults suit a local XAMPP install.
// For production, copy config.example.php to config.local.php and put the real values there
// (config.local.php is git-ignored so passwords never reach GitHub).
$servername = 'localhost';
$username   = 'root';
$password   = '';
$dbname     = 'nyumbani_db';

if (file_exists(__DIR__ . '/config.local.php')) {
    include __DIR__ . '/config.local.php';
}

$conn = @mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    error_log('Nyumbani DB connection failed: ' . mysqli_connect_error());
    http_response_code(500);
    die('The site is temporarily unavailable. Please try again later.');
}
mysqli_set_charset($conn, 'utf8mb4');
