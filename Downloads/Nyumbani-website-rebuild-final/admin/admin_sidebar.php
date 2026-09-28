<?php
// 1. Get the current file name to highlight the active link
$current_page = basename($_SERVER['PHP_SELF']);

// 2. Fetch the unread messages count from the database
$unread_count = 0;
if (isset($conn)) {
    $count_res = mysqli_query($conn, "SELECT COUNT(*) as total FROM messages WHERE status = 'unread'");
    if ($count_res) {
        $count_data = mysqli_fetch_assoc($count_res);
        $unread_count = $count_data['total'];
    }
}

// 3. Get the logged-in user's name from the session
// This will display "David" or "Mark" based on your 'users' table session
$admin_name = isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Administrator';
?>

<style>
    /* 1. The Sidebar Container */
    .admin-sidebar {
        width: 260px;
        background: #062269;
        color: white;
        padding: 25px 15px;
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        box-sizing: border-box;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        font-family: 'Poppins', sans-serif;
    }

    /* 2. User Profile Styles */
    .user-profile-section {
        display: flex;
        align-items: center;
        padding: 0 10px 25px 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        background: #4175FC;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-weight: bold;
        color: white;
        font-size: 18px;
        text-transform: uppercase;
    }

    .user-info {
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-size: 14px;
        font-weight: 600;
        color: white;
        text-transform: capitalize;
    }

    .user-status {
        font-size: 11px;
        color: #2ecc71;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .user-status::before {
        content: "";
        width: 6px;
        height: 6px;
        background: #2ecc71;
        border-radius: 50%;
    }

    /* 3. The Navigation Styles */
    .admin-nav-link {
        color: #bdc3c7 !important;
        text-decoration: none !important;
        padding: 12px 15px; 
        border-radius: 8px;
        margin-bottom: 5px;
        display: flex; 
        align-items: center;
        transition: 0.3s;
        font-size: 14px;
    }

    .admin-nav-link i {
        margin-right: 15px;
        width: 20px;
        text-align: center;
        font-size: 16px;
    }

    .admin-nav-link:hover, 
    .admin-nav-link.active {
        background: #4175FC !important;
        color: white !important;
    }

    /* 4. Notification Badge Style */
    .msg-badge {
        background: #ff7675;
        color: white;
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 20px;
        margin-left: auto;
        font-weight: 700;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .nav-label {
        font-size: 11px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        margin: 20px 0 10px 15px;
        letter-spacing: 1px;
        font-weight: 700;
    }

    .admin-nav-container { flex: 1; }

    .admin-sidebar-footer {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    .admin-sidebar h2 {
        font-size: 20px;
        margin-bottom: 25px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 10px;
        color: white !important;
    }
</style>

<aside class="admin-sidebar">
    <div class="admin-nav-container">
        <h2>Nyumbani Admin</h2>

        <div class="user-profile-section">
            <div class="user-avatar">
                <?php echo strtoupper(substr($admin_name, 0, 1)); ?>
            </div>
            <div class="user-info">
                <span class="user-name"><?php echo htmlspecialchars($admin_name); ?></span>
                <span class="user-status">Online Now</span>
            </div>
        </div>
        
        <a href="manage_gallery.php" class="admin-nav-link <?php echo ($current_page == 'manage_gallery.php') ? 'active' : ''; ?>">
            <i class="fas fa-images"></i> Manage Gallery
        </a>
        
        <a href="manage_blog.php" class="admin-nav-link <?php echo ($current_page == 'manage_blog.php') ? 'active' : ''; ?>">
            <i class="fas fa-blog"></i> Blog Posts
        </a>

        <a href="manage_jobs.php" class="admin-nav-link <?php echo ($current_page == 'manage_jobs.php') ? 'active' : ''; ?>">
            <i class="fas fa-briefcase"></i> Manage Careers
        </a>

        <div class="nav-label">Resource Archive</div>

        <a href="manage_newsletters.php" class="admin-nav-link <?php echo ($current_page == 'manage_newsletters.php') ? 'active' : ''; ?>">
            <i class="fas fa-newspaper"></i> Newsletters
        </a>

        <a href="manage_annual_reports.php" class="admin-nav-link <?php echo ($current_page == 'manage_annual_reports.php') ? 'active' : ''; ?>">
            <i class="fas fa-chart-line"></i> Annual Reports
        </a>

        <a href="manage_audit_reports.php" class="admin-nav-link <?php echo ($current_page == 'manage_audit_reports.php') ? 'active' : ''; ?>">
            <i class="fas fa-file-invoice-dollar"></i> Audit Reports
        </a>

        <a href="manage_messages.php" class="admin-nav-link <?php echo ($current_page == 'manage_messages.php') ? 'active' : ''; ?>">
            <i class="fas fa-envelope"></i> Messages
            <?php if($unread_count > 0): ?>
                <span class="msg-badge"><?php echo $unread_count; ?></span>
            <?php endif; ?>
        </a>
    </div>

    <div class="admin-sidebar-footer">
        <a href="../index.php" class="admin-nav-link" target="_blank">
            <i class="fas fa-globe"></i> Visit Website
        </a>
        <a href="logout.php" class="admin-nav-link" style="color: #ff7675 !important;">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </div>
</aside>