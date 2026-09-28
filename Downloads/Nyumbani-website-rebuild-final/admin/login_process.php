<?php
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();
include 'db.php';

if (!isset($_POST['login_submit'])) {
    header("Location: login.php");
    exit();
}

$username = trim($_POST['user'] ?? '');
$password = (string)($_POST['pass'] ?? '');

$stmt = mysqli_prepare($conn, "SELECT id, username, password FROM users WHERE username = ? LIMIT 1");
mysqli_stmt_bind_param($stmt, 's', $username);
mysqli_stmt_execute($stmt);
$row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

$ok = false;
if ($row) {
    $stored = $row['password'];
    if (password_get_info($stored)['algo']) {
        // Password is already hashed
        $ok = password_verify($password, $stored);
    } elseif (hash_equals($stored, $password)) {
        // Legacy plain-text password: accept it once, then replace it with a hash
        $ok = true;
        $new = password_hash($password, PASSWORD_DEFAULT);
        $up  = mysqli_prepare($conn, "UPDATE users SET password = ? WHERE id = ?");
        mysqli_stmt_bind_param($up, 'si', $new, $row['id']);
        mysqli_stmt_execute($up);
    }
}

if ($ok) {
    session_regenerate_id(true);          // prevents session fixation
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id']        = $row['id'];
    $_SESSION['admin_name']      = $row['username'];
    header("Location: admin.php");
    exit();
}

sleep(1);                                 // slows down password guessing
header("Location: login.php?error=1");
exit();
