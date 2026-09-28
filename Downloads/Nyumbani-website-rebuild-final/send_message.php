<?php
include 'admin/db.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: contact.php");
    exit();
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation and length limits matching the database columns
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($name) > 255 || strlen($email) > 255 || strlen($subject) > 100 || strlen($message) > 5000) {
    header("Location: contact.php?error=1");
    exit();
}

$stmt = mysqli_prepare($conn, "INSERT INTO messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'unread')");
mysqli_stmt_bind_param($stmt, 'ssss', $name, $email, $subject, $message);

if (mysqli_stmt_execute($stmt)) {
    header("Location: contact.php?success=1");
} else {
    error_log('Message insert failed: ' . mysqli_error($conn));
    header("Location: contact.php?error=1");
}
exit();
