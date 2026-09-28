<?php
session_start();
include 'db.php';
include 'helpers.php';
require_admin();

if (isset($_POST['submit_blog'])) {
    $title    = trim($_POST['blog_title'] ?? '');
    $content  = trim($_POST['blog_content'] ?? '');
    $status   = clean_choice($_POST['blog_status'] ?? '', ['draft', 'published'], 'published');
    $uploader = $_SESSION['admin_name'];
    $db_path  = '';

    // Image is optional, but if one is chosen it must be a valid image
    $chosen = ($_FILES['blog_img']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    if ($chosen) {
        $db_path = safe_upload($_FILES['blog_img'], 'blog', IMAGE_TYPES);
        if (!$db_path) { header("Location: manage_blog.php?error=upload"); exit; }
    }

    $stmt = mysqli_prepare($conn, "INSERT INTO blog_posts (title, content, image_path, status, uploaded_by) VALUES (?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, 'sssss', $title, $content, $db_path, $status, $uploader);

    if (mysqli_stmt_execute($stmt)) {
        header("Location: manage_blog.php?success=1");
    } else {
        error_log('blog insert failed: ' . mysqli_error($conn));
        header("Location: manage_blog.php?error=save");
    }
    exit;
}
