<?php 
// 1. Connect to the database
include 'admin/db.php'; 

// 2. Fetch the MOST RECENT post for the Featured Section
$featured_query = mysqli_query($conn, "SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 1");
$featured_post = mysqli_fetch_assoc($featured_query);

// 3. Fetch ALL posts for the grid
$grid_query = mysqli_query($conn, "SELECT * FROM blog_posts ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>News & Stories – Nyumbani Children's Home</title>
    
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    
    <style>
       
        .filter-btn, .blog-info h3, .featured-content h1, .btn-read { text-align: center !important; justify-content: center !important; }
        .featured-post { position: relative; background: #062269; color: #fff; padding: 100px 0; overflow: hidden; margin-bottom: 60px; }
        .featured-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; text-align: center; }
        .featured-badge { background: #4175FC; padding: 5px 15px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .featured-post h1 { font-size: 48px; color: #fff !important; margin: 20px 0; line-height: 1.2; }
        .blog-filters { display: flex; justify-content: center; gap: 12px; margin-bottom: 50px; flex-wrap: wrap; padding: 0 15px; }
        .filter-btn { background: #f4f6f9; border: 2px solid transparent; padding: 10px 25px; border-radius: 50px; font-size: 14px; cursor: pointer; transition: 0.3s; font-weight: 600; white-space: nowrap; text-align: center !important; }
        .filter-btn.active, .filter-btn:hover { background: #4175FC; color: #fff !important; border-color: #4175FC; }
        .blog-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; margin-bottom: 80px; }
        .blog-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: all 0.4s ease; display: flex; flex-direction: column; border: 1px solid #eee; }
        .blog-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        .blog-img { height: 220px; background-size: cover; background-position: center; }
        .blog-info { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
        .blog-info p { text-align: left !important; margin-bottom: 20px; color: #666; }
        .btn-read { color: #4175FC; font-weight: 700; text-decoration: none; margin-top: auto; }
    </style>
</head>
<body>

    <?php include 'header.php'; ?>

    <section class="featured-post">
        <div class="blog-container">
            <div class="featured-content">
                <?php if ($featured_post): ?>
                    <span class="featured-badge">Latest Story</span>
                    <h1><?php echo htmlspecialchars($featured_post['title']); ?></h1>
                    <p><?php echo htmlspecialchars(substr($featured_post['content'], 0, 150)); ?>...</p>
                    <a href="view_post.php?id=<?php echo $featured_post['id']; ?>" class="btn-read" style="color:#fff; border-bottom: 2px solid #fff;">
                        Read Full Story <i class="fas fa-arrow-right"></i>
                    </a>
                <?php else: ?>
                    <h1>Welcome to our Blog</h1>
                    <p>Check back soon for news and success stories.</p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <div class="blog-container">
        
        <div class="blog-filters">
            <button class="filter-btn active" data-filter="all">All Posts</button>
            <button class="filter-btn" data-filter="success">Success Stories</button>
            <button class="filter-btn" data-filter="programs">Programs</button>
            <button class="filter-btn" data-filter="events">Events</button>
        </div>

        <div class="blog-grid" id="blog-grid">
            
            <?php 
            if (mysqli_num_rows($grid_query) > 0):
                while($post = mysqli_fetch_assoc($grid_query)): 
                    // Set image path (use a default if empty)
                    $img = !empty($post['image_path']) ? $post['image_path'] : 'images/blog_default.jpg';
                    // Category logic (optional: you can add a category column to your DB)
                    $category = isset($post['category']) ? $post['category'] : 'all';
            ?>
                <article class="blog-card" data-category="<?php echo htmlspecialchars($category); ?>">
                    <div class="blog-img" style="background-image: url('<?php echo htmlspecialchars($img, ENT_QUOTES); ?>');"></div>
                    <div class="blog-info">
                        <div class="blog-meta">
                            <span><i class="far fa-calendar"></i> <?php echo date('M d, Y', strtotime($post['created_at'])); ?></span>
                        </div>
                        <h3><?php echo htmlspecialchars($post['title']); ?></h3>
                        <p><?php echo htmlspecialchars(substr($post['content'], 0, 100)); ?>...</p>
                        <a href="view_post.php?id=<?php echo $post['id']; ?>" class="btn-read">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            <?php 
                endwhile; 
            else:
                echo "<p>No stories found.</p>";
            endif;
            ?>

        </div>
    </div>

    <?php include 'footer.php'; ?>

    <script>
        // Javascript filtering logic stays the same
        const filterButtons = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');

                blogCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    </script>

</body>
</html>