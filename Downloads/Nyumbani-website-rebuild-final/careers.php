<?php include 'admin/db.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Careers | Nyumbani</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <main>
        <section class="jobs-section gray-bg">
            <div class="container">
                <div class="section-header">
                    <h2>Current Openings</h2>
                    <div class="job-filters">
                        <button class="filter-btn active" onclick="filterJobs('all', this)">All Roles</button>
                        <button class="filter-btn" onclick="filterJobs('medical', this)">Medical</button>
                        <button class="filter-btn" onclick="filterJobs('social', this)">Social Work</button>
                        <button class="filter-btn" onclick="filterJobs('admin', this)">Admin</button>
                    </div>
                </div>

                <div id="jobs-container" class="jobs-list">
                    <?php
                    $result = mysqli_query($conn, "SELECT * FROM job_openings ORDER BY created_at DESC");
                    $has_jobs = mysqli_num_rows($result) > 0;

                    if ($has_jobs) {
                        while ($job = mysqli_fetch_assoc($result)) {
                            ?>
                            <div class="job-card" data-category="<?php echo htmlspecialchars($job['category']); ?>">
                                <div class="job-info">
                                    <h3><?php echo htmlspecialchars($job['title']); ?></h3>
                                    <p><span>📍 <?php echo htmlspecialchars($job['location']); ?></span> | <span>🕒 <?php echo htmlspecialchars($job['job_type']); ?></span></p>
                                </div>
                                <a href="contact.php" class="btn-outline">Apply Now</a>
                            </div>
                            <?php
                        }
                    }
                    ?>
                </div>

                <div id="no-jobs" class="no-results-text" style="<?php echo $has_jobs ? 'display: none;' : 'display: block;'; ?>">
                    <p>There are no open positions available in this category at the moment. Please check back soon!</p>
                </div>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>

    <script>
        function filterJobs(category, btn) {
            const jobs = document.querySelectorAll('.job-card');
            const noJobsMessage = document.getElementById('no-jobs');
            const filterBtns = document.querySelectorAll('.filter-btn');
            let found = 0;

            // 1. Handle Button Highlighting
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Filter the cards
            jobs.forEach(job => {
                if (category === 'all' || job.getAttribute('data-category') === category) {
                    job.style.display = 'flex';
                    found++;
                } else {
                    job.style.display = 'none';
                }
            });

            // 3. Show/Hide the message based on if we found anything
            noJobsMessage.style.display = (found === 0) ? 'block' : 'none';
        }
    </script>
</body>
</html>