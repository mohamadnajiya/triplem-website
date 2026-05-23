<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $name = $_POST['name'] ?? 'Unknown';
        $email = $_POST['email'] ?? 'No email provided';
        $phone = $_POST['phone'] ?? 'No phone';
        $service = $_POST['service'] ?? 'No service selected';
        $message = $_POST['message'] ?? 'No message';

        $mail = new PHPMailer(true);

        // SMTP Configuration (Using cPanel Email)
        $mail->isSMTP();
        $mail->Host = 'triplem-insurance.com'; // cPanel SMTP Server
        $mail->SMTPAuth = true;
        $mail->Username = 'info@triplem-insurance.com'; // Your cPanel Email
        $mail->Password = 'yXzwm$6b1'; // Your cPanel Email Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Use SSL
        $mail->Port = 465; // Change to 587 if 465 doesn’t work

        // Debugging (Enable for testing)
        $mail->SMTPDebug = 0; // Set to 2 for debugging, 0 for production

        // Email Headers
        $mail->setFrom('info@triplem-insurance.com', 'Triple M Insurance');
        $mail->addAddress('info@triplem-insurance.com'); // Receiver
        $mail->addReplyTo($email, $name);

        // Email Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission";
        $mail->Body = "
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Service Interested In:</strong> $service</p>
            <p><strong>Message:</strong><br>$message</p>
        ";

        if ($mail->send()) {
            echo "success";
        } else {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Invalid request";
}
?>
