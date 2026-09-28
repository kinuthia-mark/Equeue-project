<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) { header("Location: login.php"); exit; }
include 'db.php';
include 'helpers.php';
require_admin();
if (isset($_GET['delete']) || isset($_GET['publish_id']) || isset($_GET['read'])) { csrf_check(); }

// --- HANDLE UPLOAD ---
if (isset($_POST['save_audit'])) {
    $title    = trim($_POST['doc_title'] ?? '');
    $year     = (int)($_POST['report_year'] ?? 0);
    $status   = clean_choice($_POST['status'] ?? '', ['draft', 'published'], 'draft');
    $uploader = $_SESSION['admin_name'];

    $db_path = safe_upload($_FILES['pdf_file'] ?? [], 'audit', PDF_TYPES);
    if ($db_path) {
        $stmt = mysqli_prepare($conn, "INSERT INTO audit_reports (title, report_year, pdf_path, status, uploaded_by) VALUES (?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, 'sisss', $title, $year, $db_path, $status, $uploader);
        mysqli_stmt_execute($stmt);
        header("Location: manage_audit_reports.php?success=1");
    } else {
        header("Location: manage_audit_reports.php?error=upload");
    }
    exit;
}

// --- QUICK PUBLISH ---
if (isset($_GET['publish_id'])) {
    $id = (int)$_GET['publish_id'];
    mysqli_query($conn, "UPDATE audit_reports SET status = 'published' WHERE id = $id");
    header("Location: manage_audit_reports.php?updated=1");
}

// --- HANDLE DELETE ---
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $res = mysqli_query($conn, "SELECT pdf_path FROM audit_reports WHERE id = $id");
    $file = mysqli_fetch_assoc($res);
    if ($file) delete_upload($file['pdf_path']);
    mysqli_query($conn, "DELETE FROM audit_reports WHERE id = $id");
    header("Location: manage_audit_reports.php?deleted=1");
    exit;
}

$all_audits = mysqli_query($conn, "SELECT * FROM audit_reports ORDER BY report_year DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Audit Reports | Nyumbani Admin</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { display: flex !important; background: #f4f7f6 !important; margin: 0; font-family: 'Poppins', sans-serif; }
        .admin-main { flex: 1; margin-left: 260px; padding: 40px; box-sizing: border-box; }
        
        /* Layout */
        .management-layout { display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-bottom: 50px; }
        .admin-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

        /* Preview Card */
        .preview-sticky { position: sticky; top: 20px; }
        .preview-box { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px dashed #4175FC; text-align: center; }
        .preview-header { background: #f0f4ff; padding: 30px; color: #062269; font-size: 40px; }
        .preview-body { padding: 20px; }

        /* Grid UI */
        .section-title { color: #062269; border-bottom: 2px solid #eee; padding-bottom: 10px; margin: 40px 0 20px; display: flex; align-items: center; gap: 10px; }
        .audit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .audit-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #eee; transition: 0.3s; position: relative; }
        .audit-card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.05); }
        
        /* Uploaded By Badge */
        .uploader-badge { font-size: 11px; color: #27ae60; background: #e8f5e9; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px; font-weight: 600; text-transform: capitalize; }

        .status-tag { position: absolute; top: 15px; right: 15px; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
        .st-draft { background: #ffeaa7; color: #d6a312; }
        .st-published { background: #d4edda; color: #155724; }

        .btn-group { display: flex; gap: 10px; margin-top: 20px; }
        .btn-draft { background: #636e72; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; flex: 1; }
        .btn-publish { background: #4175FC; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; flex: 1; font-weight: 600; }
        
        .card-actions { margin-top: 15px; padding-top: 15px; border-top: 1px solid #f4f4f4; display: flex; gap: 10px; }
        .action-link { font-size: 13px; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 5px; }

        input, textarea { width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
    </style>
</head>
<body>

    <?php include 'admin_sidebar.php'; ?>

    <main class="admin-main">
        <div class="management-layout">
            <div class="form-side">
                <div class="admin-card">
                    <h2 style="margin-top:0;"><i class="fas fa-file-invoice-dollar" style="color:#27ae60;"></i> Post Audit Report</h2>
                    <form method="POST" enctype="multipart/form-data">
                        <input type="hidden" name="status" id="postStatus" value="draft">
                        
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="grid-column: span 2;">
                                <label style="display:block; margin-bottom:0px; font-weight:600;">Report Title</label>
                                <input type="text" name="doc_title" id="inTitle" placeholder="e.g. 2024 Audited Financial Statement" required oninput="updatePreview()">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:0px; font-weight:600;">Fiscal Year</label>
                                <input type="number" name="report_year" id="inYear" value="2025" required oninput="updatePreview()">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:0px; font-weight:600;">PDF Document</label>
                                <input type="file" name="pdf_file" accept=".pdf" required>
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="display:block; margin-bottom:0px; font-weight:600;">Brief Summary</label>
                                <textarea name="doc_description" id="inDesc" rows="3" placeholder="Summary for donors..." oninput="updatePreview()"></textarea>
                            </div>
                        </div>

                        <div class="btn-group">
                            <button type="submit" name="save_audit" class="btn-draft" onclick="setStatus('draft')">Keep as Draft</button>
                            <button type="submit" name="save_audit" class="btn-publish" onclick="setStatus('published')">Publish Audit</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="preview-side">
                <div class="preview-sticky">
                    <div class="preview-box">
                        <div class="preview-header">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div class="preview-body">
                            <h3 id="preTitle" style="margin:0; color:#062269;">Audit Title Preview</h3>
                            <p id="preYear" style="color:#27ae60; font-weight:bold; margin: 10px 0;">Year: 2025</p>
                            <p id="preDesc" style="font-size:14px; color:#666;">Description will appear here...</p>
                        </div>
                    </div>
                    <p style="text-align:center; font-size:12px; color:#999; margin-top:15px;">Uploading as: <strong><?php echo htmlspecialchars($_SESSION['admin_name']); ?></strong></p>
                </div>
            </div>
        </div>

        <h3 class="section-title"><i class="fas fa-pencil-alt" style="color:#f39c12;"></i> Pending Audits (Internal Only)</h3>
        <div class="audit-grid">
            <?php 
            mysqli_data_seek($all_audits, 0);
            $d_count = 0;
            while($row = mysqli_fetch_assoc($all_audits)): 
                if($row['status'] == 'draft'): $d_count++; ?>
                <div class="audit-card">
                    <span class="status-tag st-draft">Draft</span>
                    <span class="uploader-badge"><i class="fas fa-user-tag"></i> <?php echo htmlspecialchars($row['uploaded_by'] ?? 'Admin'); ?></span>
                    <h4 style="margin:0; color:#062269;"><?php echo htmlspecialchars($row['title']); ?></h4>
                    <small style="color:#999;">Fiscal Year: <?php echo $row['report_year']; ?></small>
                    <div class="card-actions">
                        <a href="?publish_id=<?php echo $row['id']; ?>&t=<?php echo csrf_token(); ?>" class="action-link" style="color:#27ae60;"><i class="fas fa-check-double"></i> Go Live</a>
                        <a href="?delete=<?php echo $row['id']; ?>&t=<?php echo csrf_token(); ?>" class="action-link" style="color:#e74c3c;" onclick="return confirm('Delete draft?')"><i class="fas fa-trash"></i> Delete</a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
            <?php if($d_count == 0) echo "<p style='color:#999;'>All audits are currently published.</p>"; ?>
        </div>

        <h3 class="section-title"><i class="fas fa-globe-africa" style="color:#27ae60;"></i> Live on Website</h3>
        <div class="audit-grid">
            <?php 
            mysqli_data_seek($all_audits, 0);
            $p_count = 0;
            while($row = mysqli_fetch_assoc($all_audits)): 
                if($row['status'] == 'published'): $p_count++; ?>
                <div class="audit-card">
                    <span class="status-tag st-published">Public</span>
                    <span class="uploader-badge"><i class="fas fa-user-check"></i> By: <?php echo htmlspecialchars($row['uploaded_by'] ?? 'Admin'); ?></span>
                    <h4 style="margin:0; color:#062269;"><?php echo htmlspecialchars($row['title']); ?></h4>
                    <small style="color:#999;">Fiscal Year: <?php echo $row['report_year']; ?></small>
                    <div class="card-actions">
                        <a href="../<?php echo $row['pdf_path']; ?>" target="_blank" class="action-link" style="color:#4175FC;"><i class="fas fa-file-download"></i> View File</a>
                        <a href="?delete=<?php echo $row['id']; ?>&t=<?php echo csrf_token(); ?>" class="action-link" style="color:#e74c3c;" onclick="return confirm('Remove this from public view?')"><i class="fas fa-trash"></i> Retract</a>
                    </div>
                </div>
            <?php endif; endwhile; ?>
        </div>
    </main>

    <script>
        function setStatus(val) { document.getElementById('postStatus').value = val; }
        
        function updatePreview() {
            document.getElementById('preTitle').innerText = document.getElementById('inTitle').value || "Audit Title Preview";
            document.getElementById('preYear').innerText = "Year: " + (document.getElementById('inYear').value || "2025");
            document.getElementById('preDesc').innerText = document.getElementById('inDesc').value || "Description will appear here...";
        }
    </script>
</body>
</html>