<?php
session_set_cookie_params(["httponly" => true, "samesite" => "Lax"]);
session_start();
// If already logged in, skip this page
if (isset($_SESSION['admin_logged_in'])) {
    header("Location: admin.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Nyumbani Admin Login</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f7f6; }
        .login-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        .login-card h2 { color: #062269; margin-bottom: 20px; text-align: center; }
        .error-msg { color: #e74c3c; background: #fdeaea; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-size: 14px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .btn-login { width: 100%; padding: 12px; background: #4175FC; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <h2>Admin Login</h2>
            
            <?php if(isset($_GET['error'])): ?>
                <div class="error-msg">Invalid username or password.</div>
            <?php endif; ?>

            <form action="login_process.php" method="POST">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="user" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="pass" required>
                </div>
                <button type="submit" name="login_submit" class="btn-login">Sign In</button>
            </form>
        </div>
    </div>
</body>
</html>