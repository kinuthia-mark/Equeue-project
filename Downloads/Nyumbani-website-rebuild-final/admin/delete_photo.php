<?php
session_start();
include 'db.php';
include 'helpers.php';
require_admin();
csrf_check();

$id = (int)($_GET['id'] ?? 0);

if ($id > 0) {
    $stmt = mysqli_prepare($conn, "SELECT image_path FROM gallery WHERE id = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

    if ($row) {
        delete_upload($row['image_path']);
        $del = mysqli_prepare($conn, "DELETE FROM gallery WHERE id = ?");
        mysqli_stmt_bind_param($del, 'i', $id);
        mysqli_stmt_execute($del);
    }
}
header("Location: manage_gallery.php");
exit;
