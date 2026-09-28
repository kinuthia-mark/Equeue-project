<?php
include 'admin/db.php'; // Adjust path if necessary

// 1. Get the ID and make sure it's a number to prevent SQL injection
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: blog.php");
    exit;
}

$post_id = (int)$_GET['id'];

// 2. Fetch the post (Only if it is published)
$query = "SELECT * FROM blog_posts WHERE id = $post_id AND status = 'published'";
$result = mysqli_query($conn, $query);
$post = mysqli_fetch_assoc($result);

// 3. Handle 404 - Post not found
if (!$post) {
    echo "<h2>Post not found or has been removed.</h2><a href='blog.php'>Return to Blog</a>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($post['title']); ?> | Nyumbani Blog</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --primary: #062269; --accent: #4175FC; --text: #2d3436; }
        body { font-family: 'Poppins', sans-serif; line-height: 1.8; color: var(--text); background: #fff; margin: 0; }
        
        .blog-container { max-width: 800px; margin: 60px auto; padding: 0 20px; }
        
        .back-link { text-decoration: none; color: var(--accent); font-weight: 600; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 30px; transition: 0.2s; }
        .back-link:hover { transform: translateX(-5px); }

        .post-meta { color: #888; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .post-title { font-size: 2.8rem; color: var(--primary); line-height: 1.2; margin-bottom: 25px; }
        
        .feature-image { width: 100%; height: 450px; object-fit: cover; border-radius: 15px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        
        .post-content { font-size: 1.15rem; color: #444; white-space: pre-line; /* Keeps paragraph breaks */ }
        .post-content p { margin-bottom: 20px; }
        
        .blog-footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; text-align: center; }
        
        @media (max-width: 768px) {
            .post-title { font-size: 2rem; }
            .feature-image { height: 300px; }
        }
    </style>
</head>
<body>

    <article class="blog-container">
        <a href="blog.php" class="back-link"><i class="fas fa-arrow-left"></i> Back to All Stories</a>

        <header>
            <div class="post-meta">
                <i class="far fa-calendar-alt"></i> <?php echo date('M d, Y', strtotime($post['created_at'])); ?> 
                <?php if(!empty($post['author'])): ?>
                    <span style="margin: 0 10px;">|</span> <i class="far fa-user"></i> By <?php echo htmlspecialchars($post['author']); ?>
                <?php endif; ?>
            </div>
            <h1 class="post-title"><?php echo htmlspecialchars($post['title']); ?></h1>
        </header>

        <?php if (!empty($post['image_path'])): ?>
            <img src="<?php echo htmlspecialchars($post['image_path']); ?>" alt="Featured Image" class="feature-image">
        <?php endif; ?>

        <div class="post-content">
            <?php echo nl2br(htmlspecialchars($post['content'])); ?>
        </div>

        <footer class="blog-footer">
            <p>Thanks for reading! Share this story to help support Nyumbani's mission.</p>
            <div class="share-buttons">
                </div>
        </footer>
    </article>

</body>
</html>