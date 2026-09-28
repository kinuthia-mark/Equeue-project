<?php 
include 'admin/db.php'; 

// 1. Fetch unique years from the database to build the timeline
$year_query = mysqli_query($conn, "SELECT DISTINCT YEAR(publish_date) as yr FROM newsletters ORDER BY yr DESC");

// 2. Fetch all newsletters for the grid
$news_query = mysqli_query($conn, "SELECT *, YEAR(publish_date) as yr FROM newsletters ORDER BY publish_date DESC");
$has_news = mysqli_num_rows($news_query) > 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter | Nyumbani Newsroom</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <?php include 'header.php'; ?>

    <main>
        <section class="sub-hero">
            <div class="container">
                <h1>Nyumbani Newsroom</h1>
                <p>Digital archive of our impact and stories.</p>
            </div>
        </section>

        <section class="container archive-section">
            <div class="archive-header">
                <h2>Publications</h2>
                
                <div class="timeline-wrapper">
                    <button class="scroll-btn" onclick="scrollTimeline(-150)">&#10094;</button>
                    <div class="timeline-scroll" id="timeline">
                        <button class="filter active" data-filter="all">All</button>
                        
                        <?php 
                        // Generate a button for every year found in the database
                        while($year_row = mysqli_fetch_assoc($year_query)): 
                        ?>
                            <button class="filter" data-filter="<?php echo $year_row['yr']; ?>">
                                <?php echo $year_row['yr']; ?>
                            </button>
                        <?php endwhile; ?>
                    </div>
                    <button class="scroll-btn" onclick="scrollTimeline(150)">&#10095;</button>
                </div>
            </div>

            <div id="no-results" class="no-results-text" style="display: none; padding: 40px; text-align: center; color: #666;">
                <p>No newsletters found for this year. Please check back later!</p>
            </div>

            <div class="newsletter-grid" id="news-grid">
                <?php 
                if ($has_news):
                    while($news = mysqli_fetch_assoc($news_query)): 
                        $thumb = $news['thumbnail_path'];
                        $pdf =  $news['pdf_path'];
                ?>
                <article class="newsletter-card" data-year="<?php echo $news['yr']; ?>">
                    <div class="news-thumb">
                        <img src="<?php echo htmlspecialchars($thumb); ?>" alt="Newsletter Cover">
                        <span class="news-date"><?php echo date('M Y', strtotime($news['publish_date'])); ?></span>
                    </div>
                    <div class="news-body">
                        <h3><?php echo htmlspecialchars($news['title']); ?></h3>
                        <p><?php echo htmlspecialchars($news['description']); ?></p>
                        <a href="<?php echo htmlspecialchars($pdf); ?>" target="_blank" class="read-link">Read PDF →</a>
                    </div>
                </article>
                <?php 
                    endwhile; 
                else:
                    echo "<p style='grid-column: 1/-1; text-align: center;'>No publications available.</p>";
                endif;
                ?>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>

    <script>
        // Scroll the timeline left or right
        function scrollTimeline(amount) {
            document.getElementById('timeline').scrollBy({ left: amount, behavior: 'smooth' });
        }

        // Filter functionality
        const filters = document.querySelectorAll('.filter');
        const cards = document.querySelectorAll('.newsletter-card');
        const noResults = document.getElementById('no-results');
        const grid = document.getElementById('news-grid');

        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // 1. Toggle active class on buttons
                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                const selectedYear = filter.getAttribute('data-filter');
                let foundItems = 0;

                // 2. Loop through cards and show/hide
                cards.forEach(card => {
                    const cardYear = card.getAttribute('data-year');
                    if (selectedYear === 'all' || cardYear === selectedYear) {
                        card.style.display = 'block';
                        foundItems++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // 3. Display "No Results" message if year is empty
                if (foundItems === 0) {
                    noResults.style.display = 'block';
                    grid.style.display = 'none';
                } else {
                    noResults.style.display = 'none';
                    grid.style.display = 'grid';
                }
            });
        });
    </script>
</body>
</html>