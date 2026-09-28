<?php
session_start();
include 'db.php';
include 'helpers.php';
require_admin();

if (isset($_POST['submit_gallery'])) {
    $caption  = trim($_POST['caption'] ?? '');
    $uploader = $_SESSION['admin_name'];

    $db_path = safe_upload($_FILES['gallery_img'] ?? [], 'gallery', IMAGE_TYPES);
    if (!$db_path) { header("Location: manage_gallery.php?error=upload"); exit; }

    $stmt = mysqli_prepare($conn, "INSERT INTO gallery (caption, image_path, uploaded_by) VALUES (?, ?, ?)");
    mysqli_stmt_bind_param($stmt, 'sss', $caption, $db_path, $uploader);

    if (mysqli_stmt_execute($stmt)) {
        header("Location: manage_gallery.php?success=1");
    } else {
        error_log('gallery insert failed: ' . mysqli_error($conn));
        header("Location: manage_gallery.php?error=save");
    }
    exit;
}
