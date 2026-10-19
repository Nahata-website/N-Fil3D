<?php
// Handles contact, bulk quote, newsletter and waitlist forms. Runs on Hostinger's PHP.
// Set the inbox below. For better delivery, create a mailbox like website@nfil3d.com in Hostinger.
$TO = 'sales@nfil3d.com';
$FROM = 'website@nfil3d.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /contact/'); exit; }
if (!empty($_POST['website'])) { header('Location: /'); exit; } // spam trap

$clean = function ($v) { return trim(str_replace(["\r", "\n"], ' ', strip_tags((string)$v))); };
$type = $clean($_POST['type'] ?? 'contact');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$email) { http_response_code(400); echo 'Please go back and enter a valid email address.'; exit; }

$fields = ['name', 'company', 'phone', 'materials', 'quantity', 'message'];
$body = "Form: $type\nEmail: $email\n";
foreach ($fields as $f) { if (!empty($_POST[$f])) $body .= ucfirst($f) . ': ' . trim(strip_tags((string)$_POST[$f])) . "\n"; }
$body .= "\nPage: " . ($_SERVER['HTTP_REFERER'] ?? '') . "\nTime: " . date('c') . "\n";

$subjects = ['bulk-quote' => 'Bulk quote request', 'newsletter' => 'Newsletter sign-up', 'qube-waitlist' => 'Big Qube waitlist', 'contact' => 'Website enquiry'];
$subject = 'NFIL3D website: ' . ($subjects[$type] ?? 'Website form');
$headers = "From: NFIL3D Website <$FROM>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
@mail($TO, $subject, $body, $headers);

header('Location: /contact/?sent=1#main');
exit;
