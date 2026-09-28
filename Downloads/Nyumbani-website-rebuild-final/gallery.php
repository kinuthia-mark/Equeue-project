<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery | Nyumbani Children's Home & COGRI</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>

   <?php 
     include 'header.php'; 
     include 'admin/db.php'; // Include the database connection
   ?>

    <main>
        <section class="sub-hero">
            <div class="container">
                <h1>Our Gallery</h1>
                <p>Capturing moments of hope, growth, and community across all Nyumbani programs.</p>
            </div>
        </section>

        <section class="gallery-section container">
            <div class="gallery-grid">
                
                <?php
                // 1. Fetch images from the database (Newest first)
                $query = "SELECT * FROM gallery ORDER BY upload_date DESC";
                $result = mysqli_query($conn, $query);

                // 2. Check if there are any images
                if (mysqli_num_rows($result) > 0) {
                    while($row = mysqli_fetch_assoc($result)) {
                        ?>
                        <div class="gallery-item">
                            <img src="<?php echo htmlspecialchars($row['image_path']); ?>" alt="<?php echo htmlspecialchars($row['caption']); ?>">
                            <div class="image-caption"><?php echo htmlspecialchars($row['caption']); ?></div>
                        </div>
                        <?php
                    }
                } else {
                    echo "<p>No photos uploaded yet.</p>";
                }
                ?>

            </div>
        </section>

        <section class="gray-bg">
            <div class="container center">
                <h2>Video Stories</h2>
                <div class="video-container" style="margin-top: 30px;">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/_xPID_ZST1Y" title="Nyumbani Stories" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </section>
    </main>

   <?php include 'footer.php'; ?>

</body>
</html>