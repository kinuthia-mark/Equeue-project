<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) { header("Location: login.php"); exit; }
include 'db.php';
include 'helpers.php';
require_admin();
if (isset($_GET['delete']) || isset($_GET['publish_id']) || isset($_GET['read'])) { csrf_check(); }

// --- QUICK PUBLISH & DELETE ---
if (isset($_GET['publish_id'])) {
    $id = (int)$_GET['publish_id'];
    mysqli_query($conn, "UPDATE blog_posts SET status = 'published' WHERE id = $id");
    header("Location: manage_blog.php?updated=1");
}

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $res = mysqli_query($conn, "SELECT image_path FROM blog_posts WHERE id = $id");
    $file = mysqli_fetch_assoc($res);
    if ($file) { delete_upload($file['image_path']); }
    mysqli_query($conn, "DELETE FROM blog_posts WHERE id = $id");
    header("Location: manage_blog.php?deleted=1");
    exit;
}

$all_posts_query = mysqli_query($conn, "SELECT * FROM blog_posts ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Blog Management | Nyumbani</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { display: flex !important; background: #f4f7f6 !important; margin: 0; font-family: 'Poppins', sans-serif; }
        .admin-main { flex: 1; margin-left: 260px; padding: 40px; }
        .management-layout { display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-bottom: 50px; }
        .admin-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .preview-sticky { position: sticky; top: 40px; }
        .preview-box { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: 1px dashed #4175FC; }
        .preview-label { background: #4175FC; color: white; padding: 5px 15px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .preview-thumb { width: 100%; height: 200px; background: #eee; object-fit: cover; display: flex; align-items: center; justify-content: center; color: #999; }
        .preview-content { padding: 20px; }
        
        .btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn-draft { background: #636e72; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1; }
        .btn-publish { background: #4175FC; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; flex: 1; font-weight: bold; }

        .section-title { color: #062269; border-bottom: 2px solid #eee; padding-bottom: 10px; margin: 40px 0 20px; display: flex; align-items: center; gap: 10px; }
        .manage-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
        .manage-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: 0.3s; border: 1px solid #eee; display: flex; flex-direction: column; }
        .manage-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        .mc-thumb-box { position: relative; height: 160px; background: #f0f0f0; }
        .mc-thumb { width: 100%; height: 100%; object-fit: cover; }
        .mc-status-overlay { position: absolute; top: 10px; right: 10px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .st-draft { background: #ffeaa7; color: #d6a312; }
        .st-published { background: #55efc4; color: #00b894; }

        .mc-content { padding: 20px; flex-grow: 1; }
        .mc-date { color: #999; font-size: 13px; }
        .mc-title { margin: 5px 0; font-size: 18px; color: #062269; }

        .mc-actions { padding: 15px; background: #f8f9fa; border-top: 1px solid #eee; display: flex; gap: 10px; }
        .mc-btn { flex: 1; text-align: center; padding: 10px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; }
        .mc-btn-go-live { background: #27ae60; color: white; }
        .mc-btn-delete { background: #fff; color: #e74c3c; border: 1px solid #e74c3c; }
        
        .empty-state { padding: 30px; text-align: center; background: #fff; border-radius: 12px; color: #999; width: 100%; }
        
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
    </style>
</head>
<body>

    <?php include 'admin_sidebar.php'; ?>

    <main class="admin-main">
        <div class="management-layout">
            <div class="form-container">
                <div class="admin-card">
                    <h2><i class="fas fa-pen-fancy"></i> Create Blog Post</h2>
                    <form action="blog_handler.php" method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="blog_status" id="postStatus" value="draft">
                        <div style="display:flex; flex-direction:column; gap:15px;">
                            <label>Post Title</label>
                            <input type="text" name="blog_title" id="inTitle" placeholder="The Future of Nyumbani" required oninput="updatePreview()">
                            
                            <label>Content (Story)</label>
                            <textarea name="blog_content" id="inDesc" rows="8" placeholder="Start writing..." required oninput="updatePreview()"></textarea>
                            
                            <label>Featured Image</label>
                            <input type="file" name="blog_img" id="inThumb" accept="image/*" onchange="previewImage(this)">
                        </div>
                        <div class="btn-group">
                            <button type="submit" name="submit_blog" class="btn-draft" onclick="setStatus('draft')">Save as Draft</button>
                            <button type="submit" name="submit_blog" class="btn-publish" onclick="setStatus('published')">Publish Story</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="preview-sticky">
                <div class="preview-box">
                    <div class="preview-label">Live Preview</div>
                    <div id="imgPreview" class="preview-thumb"><i class="fas fa-image fa-2x"></i></div>
                    <div class="preview-content">
                        <h3 id="preTitle" style="margin: 0 0 10px; color:#062269;">Title Preview</h3>
                        <p id="preDesc" style="font-size:14px; color:#444; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">Your story will begin here...</p>
                    </div>
                </div>
            </div>
        </div>

        <h3 class="section-title"><i class="fas fa-pencil-ruler" style="color: #f39c12;"></i> Saved Drafts</h3>
        <div class="manage-grid">
            <?php 
            $drafts_found = false;
            mysqli_data_seek($all_posts_query, 0);
            while($post = mysqli_fetch_assoc($all_posts_query)):
                if($post['status'] == 'draft'): $drafts_found = true; ?>
                <div class="manage-card">
                    <div class="mc-thumb-box">
                        <?php if(!empty($post['image_path'])): ?>
                            <img src="../<?php echo $post['image_path']; ?>" class="mc-thumb">
                        <?php else: ?>
                            <div class="mc-thumb" style="display:flex; align-items:center; justify-content:center; background:#eee;"><i class="fas fa-pen-nib"></i></div>
                        <?php endif; ?>
                        <span class="mc-status-overlay st-draft">Draft</span>
                    </div>
                    <div class="mc-content">
                        <div class="mc-date"><?php echo date('M d, Y', strtotime($post['created_at'])); ?></div>
                        <h4 class="mc-title"><?php echo htmlspecialchars($post['title']); ?></h4>
                    </div>
                    <div class="mc-actions">
                        <a href="?publish_id=<?php echo $post['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-go-live"><i class="fas fa-check"></i> Go Live</a>
                        <a href="?delete=<?php echo $post['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-delete" onclick="return confirm('Delete permanently?')"><i class="fas fa-trash"></i></a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
            <?php if(!$drafts_found) echo '<div class="empty-state">No drafts found.</div>'; ?>
        </div>

        <h3 class="section-title"><i class="fas fa-globe-africa" style="color: #27ae60;"></i> Live on Blog</h3>
        <div class="manage-grid">
            <?php 
            $published_found = false;
            mysqli_data_seek($all_posts_query, 0);
            while($post = mysqli_fetch_assoc($all_posts_query)):
                if($post['status'] == 'published'): $published_found = true; ?>
                <div class="manage-card">
                    <div class="mc-thumb-box">
                        <?php if(!empty($post['image_path'])): ?>
                            <img src="../<?php echo $post['image_path']; ?>" class="mc-thumb">
                        <?php endif; ?>
                        <span class="mc-status-overlay st-published">Live</span>
                    </div>
                    <div class="mc-content">
                        <div class="mc-date"><?php echo date('M d, Y', strtotime($post['created_at'])); ?></div>
                        <h4 class="mc-title"><?php echo htmlspecialchars($post['title']); ?></h4>
                    </div>
                    <div class="mc-actions">
                        <a href="../view_post.php?id=<?php echo $post['id']; ?>" target="_blank" class="mc-btn" style="background:#eee;">View</a>
                        <a href="?delete=<?php echo $post['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-delete" onclick="return confirm('Retract post?')">Retract</a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
            <?php if(!$published_found) echo '<div class="empty-state">No stories published yet.</div>'; ?>
        </div>
    </main>

    <script>
        function setStatus(val) { document.getElementById('postStatus').value = val; }
        function updatePreview() {
            document.getElementById('preTitle').innerText = document.getElementById('inTitle').value || "Title Preview";
            document.getElementById('preDesc').innerText = document.getElementById('inDesc').value || "Your story will begin here...";
        }
        function previewImage(input) {
            const preview = document.getElementById('imgPreview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) { preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`; }
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>