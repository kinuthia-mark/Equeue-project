<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) { 
    header("Location: login.php"); 
    exit; 
}
include 'db.php';
include 'helpers.php';
require_admin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Gallery | Nyumbani Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { 
            display: flex !important; 
            background: #f4f7f6 !important; 
            margin: 0 !important; 
            text-align: left !important;
            font-family: 'Poppins', sans-serif;
        }

        .admin-main { 
            flex: 1; 
            margin-left: 260px; 
            padding: 40px; 
            box-sizing: border-box;
        }

        .admin-card { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
            margin-bottom: 30px;
        }

        .image-preview-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
            gap: 20px; 
        }

        .img-item { 
            background: #fff; 
            padding: 10px; 
            border-radius: 8px; 
            border: 1px solid #ddd; 
            text-align: center;
        }

        .img-item img { 
            width: 100%; 
            height: 150px; 
            object-fit: cover; 
            border-radius: 4px; 
            margin-bottom: 10px;
        }

        .uploader-tag {
            font-size: 11px;
            color: #4175FC;
            background: #eef2ff;
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-bottom: 8px;
            text-transform: capitalize;
        }

        .btn-upload {
            background: #4175FC;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

    <?php include 'admin_sidebar.php'; ?>
    
    <main class="admin-main">
        <div class="admin-card">
            <h2><i class="fas fa-camera" style="color: #4175FC;"></i> Add to Gallery</h2>
            <p style="color: #666; margin-bottom: 20px;">Upload new photos to the public gallery page.</p>
            
            <form action="gallery_handler.php" method="POST" enctype="multipart/form-data">
                <div style="margin-bottom: 15px;">
                    <label>Image Caption</label>
                    <input type="text" name="caption" placeholder="e.g. Daily Life at Karen Home" required>
                </div>

                <div style="margin-bottom: 20px;">
                    <label>Select Image (JPG/PNG)</label><br>
                    <input type="file" name="gallery_img" accept="image/*" required style="margin-top: 10px;">
                </div>

                <button type="submit" name="submit_gallery" class="btn-upload">Upload Photo</button>
            </form>
        </div>

        <h3>Current Gallery Photos</h3>
        <div class="image-preview-grid">
            <?php
            $res = mysqli_query($conn, "SELECT * FROM gallery ORDER BY upload_date DESC");
            if (mysqli_num_rows($res) > 0) {
                while($row = mysqli_fetch_assoc($res)) {
                    // Pulling the uploader name from DB
                    $uploaded_by = e(!empty($row['uploaded_by']) ? $row['uploaded_by'] : 'Admin');
                    
                    echo "<div class='img-item'>
                            <img src='../".$row['image_path']."'>
                            <span class='uploader-tag'><i class='fas fa-user'></i> ".$uploaded_by."</span>
                            <p style='font-weight:600; font-size:14px; margin: 5px 0;'>".e($row['caption'])."</p>
                            <a href='delete_photo.php?id=".$row['id']."&t=".csrf_token()."' 
                               onclick='return confirm(\"Are you sure you want to delete this photo?\")' 
                               style='color:#e74c3c; text-decoration:none; font-size:13px;'>
                               <i class='fas fa-trash'></i> Delete
                            </a>
                          </div>";
                }
            } else {
                echo "<p style='color: #888;'>No photos uploaded yet.</p>";
            }
            ?>
        </div>
    </main>

</body>
</html>