<?php include 'admin/db.php'; ?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Annual Reports – Nyumbani</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <header class="reports-hero">
        <div class="container">
            <h1>Annual Reports</h1>
            <p>Transparency and accountability are at the core of our mission. Explore our yearly progress and financial highlights.</p>
        </div>
    </header>

    <section class="reports-section">
        <div class="container">
            <h2 class="center-text">Archive of Reports</h2>
            
            <div class="reports-grid">
                <?php
                // Fetch reports sorted by year
                $query = "SELECT * FROM annual_reports ORDER BY report_year DESC";
                $result = mysqli_query($conn, $query);

                if (mysqli_num_rows($result) > 0) {
                    while ($report = mysqli_fetch_assoc($result)) {
                        ?>
                        <div class="report-card">
                            <i class="fas fa-file-pdf"></i>
                            <h3><?php echo htmlspecialchars($report['title']); ?></h3>
                            <p><?php echo htmlspecialchars($report['description']); ?></p>
                            <a href="<?php echo htmlspecialchars($report['pdf_path']); ?>" 
                               class="btn-download" 
                               target="_blank">Download PDF</a>
                        </div>
                        <?php
                    }
                } else {
                    echo "<p class='center-text' style='grid-column: 1/-1;'>No reports have been uploaded yet.</p>";
                }
                ?>
            </div>
        </div>
    </section>

    <?php include 'footer.php'; ?>
</body>
</html>