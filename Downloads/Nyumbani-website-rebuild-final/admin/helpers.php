<?php
/**
 * Shared helpers for the admin area.
 * Include AFTER session_start() and db.php.
 */

const PDF_TYPES   = ['pdf' => ['application/pdf']];
const IMAGE_TYPES = [
    'jpg'  => ['image/jpeg'],
    'jpeg' => ['image/jpeg'],
    'png'  => ['image/png'],
    'webp' => ['image/webp'],
    'gif'  => ['image/gif'],
];

/** Escape a value for safe output inside HTML. */
function e($value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

/** Stop the request unless an admin is logged in. */
function require_admin(): void {
    if (empty($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header("Location: login.php");
        exit;
    }
}

/** Per-session CSRF token used on delete / publish / read links. */
function csrf_token(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_check(): void {
    $sent = (string)($_GET['t'] ?? '');
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
        http_response_code(403);
        die('Invalid or expired request. Please go back, refresh the page and try again.');
    }
}

/** Only accept known values for a status / category field. */
function clean_choice($value, array $allowed, string $default): string {
    return in_array($value, $allowed, true) ? $value : $default;
}

/**
 * Validate and store an uploaded file.
 * Checks: upload OK, size, extension whitelist, real MIME type.
 * Returns the path to store in the database (e.g. "uploads/reports/x.pdf") or null.
 */
function safe_upload(array $file, string $subdir, array $allowed, int $max_bytes = 10485760): ?string {
    if (empty($file['tmp_name']) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return null;
    if (!is_uploaded_file($file['tmp_name']) || $file['size'] > $max_bytes) return null;

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!isset($allowed[$ext])) return null;

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (!in_array($finfo->file($file['tmp_name']), $allowed[$ext], true)) return null;

    $dir = __DIR__ . '/../uploads/' . $subdir . '/';
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) return null;

    $name = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;   // never reuse the visitor's filename
    if (!move_uploaded_file($file['tmp_name'], $dir . $name)) return null;

    return 'uploads/' . $subdir . '/' . $name;
}

/** Delete a previously uploaded file, only if it really lives inside /uploads. */
function delete_upload(?string $db_path): void {
    if (!$db_path) return;
    $base = realpath(__DIR__ . '/../uploads');
    $full = realpath(__DIR__ . '/../' . $db_path);
    if ($base && $full && strpos($full, $base . DIRECTORY_SEPARATOR) === 0 && is_file($full)) {
        unlink($full);
    }
}
