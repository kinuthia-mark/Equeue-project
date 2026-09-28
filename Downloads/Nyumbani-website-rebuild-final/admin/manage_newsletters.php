<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) { header("Location: login.php"); exit; }
include 'db.php';
include 'helpers.php';
require_admin();
if (isset($_GET['delete']) || isset($_GET['publish_id']) || isset($_GET['read'])) { csrf_check(); }

// --- HANDLE UPLOAD (Draft or Publish) ---
if (isset($_POST['save_newsletter'])) {
    $title    = trim($_POST['title'] ?? '');
    $desc     = trim($_POST['description'] ?? '');
    $ts       = strtotime($_POST['publish_date'] ?? '');
    $p_date   = date('Y-m-d', $ts ?: time());
    $status   = clean_choice($_POST['status'] ?? '', ['draft', 'published'], 'draft');
    $uploader = $_SESSION['admin_name'];

    $pdf_db   = safe_upload($_FILES['pdf_file'] ?? [], 'newsletters', PDF_TYPES);
    $thumb_db = safe_upload($_FILES['thumb_file'] ?? [], 'newsletters', IMAGE_TYPES);

    if ($pdf_db && $thumb_db) {
        $stmt = mysqli_prepare($conn, "INSERT INTO newsletters (title, description, publish_date, pdf_path, thumbnail_path, status, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, 'sssssss', $title, $desc, $p_date, $pdf_db, $thumb_db, $status, $uploader);
        mysqli_stmt_execute($stmt);
        header("Location: manage_newsletters.php?success=1");
    } else {
        delete_upload($pdf_db);      // don't leave half-uploaded files behind
        delete_upload($thumb_db);
        header("Location: manage_newsletters.php?error=upload");
    }
    exit;
}

// --- QUICK PUBLISH & DELETE ---
if (isset($_GET['publish_id'])) {
    $id = (int)$_GET['publish_id'];
    mysqli_query($conn, "UPDATE newsletters SET status = 'published' WHERE id = $id");
    header("Location: manage_newsletters.php?updated=1");
}
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $res = mysqli_query($conn, "SELECT pdf_path, thumbnail_path FROM newsletters WHERE id = $id");
    $files = mysqli_fetch_assoc($res);
    if ($files) { 
        delete_upload($files['pdf_path']); 
        delete_upload($files['thumbnail_path']); 
    }
    mysqli_query($conn, "DELETE FROM newsletters WHERE id = $id");
    header("Location: manage_newsletters.php?deleted=1");
    exit;
}

$all_news_query = mysqli_query($conn, "SELECT * FROM newsletters ORDER BY publish_date DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Newsletter Management | Nyumbani</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { display: flex !important; background: #f4f7f6 !important; margin: 0; font-family: 'Poppins', sans-serif; }
        .admin-main { flex: 1; margin-left: 260px; padding: 40px; }
        .management-layout { display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-bottom: 50px; }
        .admin-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        
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

        .mc-thumb-box { position: relative; height: 160px; }
        .mc-thumb { width: 100%; height: 100%; object-fit: cover; }
        
        /* New Badge for Admin name */
        .admin-badge { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; }

        .mc-status-overlay { position: absolute; top: 10px; right: 10px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .st-draft { background: #ffeaa7; color: #d6a312; }
        .st-published { background: #55efc4; color: #00b894; }

        .mc-content { padding: 20px; flex-grow: 1; }
        .mc-date { color: #999; font-size: 13px; }
        .mc-title { margin: 5px 0; font-size: 18px; color: #062269; }

        .mc-actions { padding: 15px; background: #f8f9fa; border-top: 1px solid #eee; display: flex; gap: 10px; }
        .mc-btn { flex: 1; text-align: center; padding: 10px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; transition: 0.2s; }
        .mc-btn-go-live { background: #27ae60; color: white; }
        .mc-btn-delete { background: #fff; color: #e74c3c; border: 1px solid #e74c3c; }
    </style>
</head>
<body>

    <?php include 'admin_sidebar.php'; ?>

    <main class="admin-main">
        <div class="management-layout">
            <div class="form-container">
                <div class="admin-card">
                    <h2><i class="fas fa-edit"></i> Create Newsletter</h2>
                    <form method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="status" id="postStatus" value="draft">
                        <div style="display:flex; flex-direction:column; gap:15px;">
                            <label>Newsletter Title</label>
                            <input type="text" name="title" id="inTitle" placeholder="August 2024 Highlights" required oninput="updatePreview()">
                            <label>Short Description</label>
                            <textarea name="description" id="inDesc" rows="3" oninput="updatePreview()"></textarea>
                            <label>Publishing Date</label>
                            <input type="date" name="publish_date" id="inDate" required oninput="updatePreview()">
                            <label>PDF Document</label>
                            <input type="file" name="pdf_file" accept=".pdf" required>
                            <label>Cover Image</label>
                            <input type="file" name="thumb_file" accept="image/*" required onchange="previewImage(this)">
                        </div>
                        <div class="btn-group">
                            <button type="submit" name="save_newsletter" class="btn-draft" onclick="setStatus('draft')">Save as Draft</button>
                            <button type="submit" name="save_newsletter" class="btn-publish" onclick="setStatus('published')">Publish Now</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="preview-sticky">
                <div class="preview-box">
                    <div class="preview-label">Live Preview</div>
                    <div id="imgPreview" class="preview-thumb"><i class="fas fa-image fa-2x"></i></div>
                    <div class="preview-content">
                        <small id="preDate" style="color:#666;">Select a date</small>
                        <h3 id="preTitle" style="margin: 10px 0; color:#062269;">Title Preview</h3>
                        <p id="preDesc" style="font-size:14px; color:#444;">Description will appear here...</p>
                    </div>
                </div>
            </div>
        </div>

        <h3 class="section-title"><i class="fas fa-pencil-ruler" style="color: #f39c12;"></i> Pending Drafts</h3>
        <div class="manage-grid">
            <?php
            mysqli_data_seek($all_news_query, 0);
            while($news = mysqli_fetch_assoc($all_news_query)):
                if($news['status'] == 'draft'): ?>
                <div class="manage-card">
                    <div class="mc-thumb-box">
                        <img src="../<?php echo $news['thumbnail_path']; ?>" class="mc-thumb">
                        <span class="mc-status-overlay st-draft">Draft</span>
                        <span class="admin-badge"><i class="fas fa-user-edit"></i> <?php echo htmlspecialchars($news['uploaded_by'] ?? 'Admin'); ?></span>
                    </div>
                    <div class="mc-content">
                        <div class="mc-date"><i class="far fa-calendar"></i> <?php echo date('M d, Y', strtotime($news['publish_date'])); ?></div>
                        <h4 class="mc-title"><?php echo htmlspecialchars($news['title']); ?></h4>
                    </div>
                    <div class="mc-actions">
                        <a href="?publish_id=<?php echo $news['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-go-live"><i class="fas fa-rocket"></i> Go Live</a>
                        <a href="?delete=<?php echo $news['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-delete" onclick="return confirm('Delete permanently?')"><i class="fas fa-trash"></i> Delete</a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
        </div>

        <h3 class="section-title"><i class="fas fa-history" style="color: #27ae60;"></i> Published History</h3>
        <div class="manage-grid">
            <?php
            mysqli_data_seek($all_news_query, 0);
            while($news = mysqli_fetch_assoc($all_news_query)):
                if($news['status'] == 'published'): ?>
                <div class="manage-card">
                    <div class="mc-thumb-box">
                        <img src="../<?php echo $news['thumbnail_path']; ?>" class="mc-thumb">
                        <span class="mc-status-overlay st-published">Live</span>
                        <span class="admin-badge"><i class="fas fa-user"></i> <?php echo htmlspecialchars($news['uploaded_by'] ?? 'Admin'); ?></span>
                    </div>
                    <div class="mc-content">
                        <div class="mc-date"><i class="far fa-calendar"></i> <?php echo date('M d, Y', strtotime($news['publish_date'])); ?></div>
                        <h4 class="mc-title"><?php echo htmlspecialchars($news['title']); ?></h4>
                    </div>
                    <div class="mc-actions">
                        <a href="../<?php echo $news['pdf_path']; ?>" target="_blank" class="mc-btn" style="background:#eee; color:#333;">View PDF</a>
                        <a href="?delete=<?php echo $news['id']; ?>&t=<?php echo csrf_token(); ?>" class="mc-btn mc-btn-delete" onclick="return confirm('Retract this newsletter?')"><i class="fas fa-trash"></i> Retract</a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
        </div>
    </main>

    <script>
        function setStatus(val) { document.getElementById('postStatus').value = val; }
        function updatePreview() {
            document.getElementById('preTitle').innerText = document.getElementById('inTitle').value || "Title Preview";
            document.getElementById('preDesc').innerText = document.getElementById('inDesc').value || "Description summary...";
            document.getElementById('preDate').innerText = document.getElementById('inDate').value || "Select a date";
        }
        function previewImage(input) {
            const preview = document.getElementById('imgPreview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => { preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`; }
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>