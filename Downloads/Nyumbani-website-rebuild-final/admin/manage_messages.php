<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) { header("Location: login.php"); exit; }
include 'db.php';
include 'helpers.php';
require_admin();
if (isset($_GET['delete']) || isset($_GET['publish_id']) || isset($_GET['read'])) { csrf_check(); }

// --- HANDLE ACTIONS ---
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM messages WHERE id = $id");
    header("Location: manage_messages.php");
}

if (isset($_GET['read'])) {
    $id = (int)$_GET['read'];
    mysqli_query($conn, "UPDATE messages SET status = 'read' WHERE id = $id");
    header("Location: manage_messages.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Message Center | Nyumbani Admin</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { display: flex !important; background: #f4f7f6 !important; margin: 0; font-family: 'Poppins', sans-serif; }
        .admin-main { flex: 1; margin-left: 260px; padding: 40px; box-sizing: border-box; }
        
        .message-card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
            margin-bottom: 20px;
            border-left: 5px solid #bdc3c7;
            transition: 0.3s;
        }
        .message-card.unread { border-left-color: #4175FC; background: #f0f4ff; }
        
        .msg-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        .msg-meta { font-size: 13px; color: #666; }
        .msg-body { color: #333; line-height: 1.6; background: #f9f9f9; padding: 15px; border-radius: 6px; }
        
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .badge-unread { background: #4175FC; color: white; }
        .badge-read { background: #eee; color: #777; }

        .actions { margin-top: 15px; display: flex; gap: 10px; }
        .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 4px; text-decoration: none; font-weight: 600; }
        .btn-read { background: #27ae60; color: white; }
        .btn-delete { background: #e74c3c; color: white; }
    </style>
</head>
<body>

    <?php include 'admin_sidebar.php'; ?>

    <main class="admin-main">
        <h2 style="color: #062269;"><i class="fas fa-envelope-open-text"></i> Visitor Inquiries</h2>
        <p>Manage messages sent from the Contact Us page.</p>

        <?php
        $res = mysqli_query($conn, "SELECT * FROM messages ORDER BY created_at DESC");
        if (mysqli_num_rows($res) > 0):
            while($msg = mysqli_fetch_assoc($res)): ?>
                <div class="message-card <?php echo $msg['status']; ?>">
                    <div class="msg-header">
                        <div>
                            <span class="badge badge-<?php echo $msg['status']; ?>"><?php echo $msg['status']; ?></span>
                            <h3 style="margin: 5px 0;"><?php echo htmlspecialchars($msg['subject']); ?></h3>
                            <div class="msg-meta">
                                <strong>From:</strong> <?php echo htmlspecialchars($msg['name']); ?> 
                                (<a href="mailto:<?php echo e($msg['email']); ?>"><?php echo e($msg['email']); ?></a>)
                            </div>
                        </div>
                        <div class="msg-meta"><?php echo date('M d, Y - h:i A', strtotime($msg['created_at'])); ?></div>
                    </div>
                    
                    <div class="msg-body">
                        <?php echo nl2br(htmlspecialchars($msg['message'])); ?>
                    </div>

                    <div class="actions">
                        <?php if($msg['status'] == 'unread'): ?>
                            <a href="?read=<?php echo $msg['id']; ?>&t=<?php echo csrf_token(); ?>" class="btn-read btn-sm">Mark as Read</a>
                        <?php endif; ?>
                        <a href="?delete=<?php echo $msg['id']; ?>&t=<?php echo csrf_token(); ?>" class="btn-delete btn-sm" onclick="return confirm('Delete this message?')">Delete</a>
                    </div>
                </div>
            <?php endwhile; 
        else: ?>
            <div class="admin-card" style="text-align: center; color: #666;">
                <i class="fas fa-inbox" style="font-size: 40px; margin-bottom: 10px;"></i>
                <p>Your inbox is empty.</p>
            </div>
        <?php endif; ?>
    </main>

</body>
</html>