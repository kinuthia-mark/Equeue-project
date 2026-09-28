<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Resources – Nyumbani Children's Home – COGRI</title>
    
    <link rel='stylesheet' id='astra-theme-css-css' href='https://nyumbani.or.ke/wp-content/themes/astra/assets/css/minified/frontend.min.css?ver=3.9.1' media='all' />
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <?php include 'header.php';
     ?>

    <style>
        :root {
            --primary-blue: #062269;
            --accent-blue: #4175FC;
            --text-gray: #494B51;
            --light-bg: #F6F7F8;
            --white: #FFFFFF;
        }

        body {
            font-family: 'Poppins', sans-serif;
            color: var(--text-gray);
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        /* Hero / Header Section */
        .resources-hero {
            background-color: var(--primary-blue);
            padding: 100px 20px;
            text-align: center !important;
            color: var(--white);
        }

        .resources-hero h1 {
            color: var(--white);
            font-size: 52px;
            margin-bottom: 20px;
        }

        .resources-hero p {
            font-size: 18px;
            max-width: 800px;
            margin: 0 auto;
            opacity: 0.9;
        }

        /* Grid Layout (Programs Style) */
        .resources-grid-section {
            padding: 80px 20px;
            background-color: var(--white);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .resources-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }

        /* Card Styling */
        .resource-card {
            background: var(--white);
            padding: 50px 30px;
            border-radius: 20px;
            text-align: center !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #eee;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .resource-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .card-icon {
            font-size: 45px;
            color: var(--accent-blue);
            margin-bottom: 25px;
        }

        .resource-card h3 {
            color: var(--primary-blue);
            font-size: 24px;
            margin-bottom: 15px;
        }

        .resource-card p {
            font-size: 15px;
            margin-bottom: 30px;
            text-align: center !important;
        }

        /* Buttons */
        .btn-resource {
            display: inline-block;
            padding: 12px 30px;
            border: 2px solid var(--accent-blue);
            color: var(--accent-blue);
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: 0.3s;
            margin-top: auto; /* Keeps button at bottom of card */
        }

        .btn-resource:hover {
            background-color: var(--accent-blue);
            color: var(--white) !important;
        }

        /* CTA / Donation Section (Centered Fix) */
        .cta-section {
            padding: 80px 20px;
            background: var(--light-bg);
            border-radius: 20px;
            margin: 60px auto 100px auto;
            max-width: 1000px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center !important;
        }

        .cta-section h2 { margin-bottom: 20px; }
        .cta-section p { max-width: 600px; margin-bottom: 30px; text-align: center !important;}

        @media (max-width: 768px) {
            .resources-hero h1 { font-size: 36px; }
        }
    </style>
</head>
<body>

    <header class="resources-hero">
        <div class="container">
            <h1>Our Resources</h1>
            <p>Access our latest publications, financial reports, and community impact stories to stay informed about Nyumbani’s mission.</p>
        </div>
    </header>

    <section class="resources-grid-section">
        <div class="container">
            <div class="resources-grid">
                
                <div class="resource-card">
                    <div class="card-icon"><i class="fas fa-envelope-open-text"></i></div>
                    <h3>Newsletters</h3>
                    <p>Read our monthly updates featuring volunteer spotlights, program success stories, and upcoming events.</p>
                    <a href="newsletter.php" class="btn-resource">View Newsletters</a>
                </div>

                <div class="resource-card">
                    <div class="card-icon"><i class="fas fa-file-invoice"></i></div>
                    <h3>Annual Reports</h3>
                    <p>Download our annual reviews detailing our organizational growth and community reach over the past year.</p>
                    <a href="annual-report.php" class="btn-resource">View Reports</a>
                </div>

                <div class="resource-card">
                    <div class="card-icon"><i class="fas fa-chart-line"></i></div>
                    <h3>Audit Reports</h3>
                    <p>Transparency is our priority. View our independently audited financial statements and transparency reports.</p>
                    <a href="audit-report.php" class="btn-resource">View Audits</a>
                </div>

                <div class="resource-card">
                    <div class="card-icon"><i class="fas fa-blog"></i></div>
                    <h3>Our Blog</h3>
                    <p>Insights and stories directly from the field. Deep dives into the lives and futures of the children we support.</p>
                    <a href="blog.php" class="btn-resource">Read Blog</a>
                </div>

            </div>
        </div>
    </section>

    <div class="container">
        <section class="cta-section">
            <h2>Support Our Mission</h2>
            <p>Your contributions help us continue providing essential resources and care to children in need.</p>
            <a href="donate.php" class="btn-resource" style="background-color: var(--accent-blue); color: white;">Donate Now</a>
        </section>
    </div>

    <?php include 'footer.php'; 
    ?>

</body>
</html>