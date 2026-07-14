<?php
/**
 * contact-handler.php — True Click SEO
 * Receives the contact form POST, validates fields,
 * and sends an email to the company inbox.
 */

// ── Configuration ────────────────────────────────
$TO_EMAIL    = 'trueclickseo@gmail.com';
$TO_NAME     = 'True Click SEO';
$SITE_NAME   = 'True Click SEO';
$FROM_DOMAIN = 'trueclickseo.com'; // your domain on Hostinger
// ────────────────────────────────────────────────

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Sanitize & Validate ──────────────────────────
function clean($value) {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name']    ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$company = clean($_POST['company'] ?? '');
$service = clean($_POST['service'] ?? '');
$budget  = clean($_POST['budget']  ?? '');
$message = clean($_POST['message'] ?? '');

// Required fields
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter your name.']);
    exit;
}

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please describe your project.']);
    exit;
}

// Basic spam check — honeypot field (hidden in form)
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected.']);
    exit;
}

// ── Build Email ──────────────────────────────────
$subject = "New enquiry from {$name} — {$SITE_NAME}";

$body = "
You have received a new enquiry via the {$SITE_NAME} contact form.

─────────────────────────────────────
CONTACT DETAILS
─────────────────────────────────────
Name:     {$name}
Email:    {$email}
Company:  " . ($company ?: 'Not provided') . "

─────────────────────────────────────
PROJECT DETAILS
─────────────────────────────────────
Service:  " . ($service ?: 'Not specified') . "
Budget:   " . ($budget  ?: 'Not specified') . "

─────────────────────────────────────
MESSAGE
─────────────────────────────────────
{$message}

─────────────────────────────────────
Reply directly to: {$email}
─────────────────────────────────────
";

// ── Email Headers ────────────────────────────────
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: {$SITE_NAME} <noreply@{$FROM_DOMAIN}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ── Send ─────────────────────────────────────────
$sent = mail($TO_EMAIL, $subject, $body, $headers);

// ── Auto-reply to the sender ──────────────────────
if ($sent) {
    $autoSubject = "We received your message — {$SITE_NAME}";
    $autoBody = "
Hi {$name},

Thank you for reaching out to True Click SEO!

We've received your enquiry and our team will review it promptly.
You can expect a response within 24 hours.

─────────────────────────────────────
YOUR MESSAGE SUMMARY
─────────────────────────────────────
Service:  " . ($service ?: 'Not specified') . "
Budget:   " . ($budget  ?: 'Not specified') . "
Message:  {$message}
─────────────────────────────────────

In the meantime, feel free to browse our work:
https://{$FROM_DOMAIN}/portfolio.html

Best regards,
The True Click SEO Team
Stockholm, Sweden · Pakistan

trueclickseo@gmail.com
https://{$FROM_DOMAIN}
";

    $autoHeaders  = "MIME-Version: 1.0\r\n";
    $autoHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $autoHeaders .= "From: {$TO_NAME} <noreply@{$FROM_DOMAIN}>\r\n";
    $autoHeaders .= "Reply-To: {$TO_NAME} <{$TO_EMAIL}>\r\n";

    mail($email, $autoSubject, $autoBody, $autoHeaders);
}

// ── Response ─────────────────────────────────────
if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => "Thank you, {$name}! Your message has been sent. We'll get back to you within 24 hours."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was a problem sending your message. Please email us directly at trueclickseo@gmail.com'
    ]);
}
