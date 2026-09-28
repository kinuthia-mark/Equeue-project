<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Nyumbani Children's Home - COGRI</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <main>
        <section class="sub-hero">
            <div class="container">
                <h1>Get In Touch</h1>
                <p>Have questions about our programs or want to support our mission? We'd love to hear from you.</p>
            </div>
        </section>

        <section class="contact-detail container">
            <div class="contact-grid">
                
                <div class="contact-info">
                    <h2>Our Offices</h2>
                    
                    <div class="info-card">
                        <h3>Main Office (Karen)</h3>
                        <p>📍 Dagoretti Road, Karen<br>P.O. Box 24970 - 00502, Nairobi, Kenya</p>
                        <p>📞 +254 722 201 161 / +254 733 621 161</p>
                        <p>📧 info@nyumbani.org</p>
                    </div>

                    <div class="info-card">
                        <h3>Nyumbani Village (Kitui)</h3>
                        <p>📍 Kitui County, Kenya</p>
                        <p>📧 village@nyumbani.org</p>
                    </div>
                </div>

                <div class="contact-form-container">
                    <?php if(isset($_GET['success'])): ?>
                        <div id="success-alert" style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-check-circle"></i>
                            <span><strong>Success!</strong> Your message has been sent.</span>
                        </div>
                        <script>
                            // Hide the alert after 5 seconds
                            setTimeout(function() {
                                var element = document.getElementById('success-alert');
                                if(element) element.style.display = 'none';
                            }, 5000);
                        </script>
                    <?php endif; ?>
                    <?php if(isset($_GET['error'])): ?>
                        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f5c6cb;">
                            <strong>Sorry,</strong> we couldn't send your message. Please check your details and try again.
                        </div>
                    <?php endif; ?>
                    <h2>Send us a Message</h2>
                    <form id="contact-form" class="main-form" action="send_message.php" method="POST">
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <select id="subject" name="subject">
                                <option value="general">General Inquiry</option>
                                <option value="donation">Donations & Sponsorship</option>
                                <option value="volunteer">Volunteering</option>
                                <option value="lab">Diagnostic Laboratory</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Send Message</button>
                    </form>
                </div>

            </div>
        </section>

        <section class="map-section">
            <div class="container">
                <h2 class="center">Find Us</h2>
                <div class="map-placeholder">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7698009841833!2d36.69614837314254!3d-1.3135868986739325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b81d6760d87%3A0xa00edd4275f7fc79!2sNYUMBANI%20-%20Children%20Home!5e0!3m2!1sen!2ske!4v1769672447238!5m2!1sen!2ske" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                        width="100%" 
                        height="450" 
                        style="border:0; border-radius: 15px;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>

</body>
</html>