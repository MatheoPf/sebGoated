<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

$ip = $_SERVER['REMOTE_ADDR'];
$logFile = 'mail_log.json';
$log = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];

$today = date('Y-m-d');

if(isset($_COOKIE['commande_envoyee'])) {
    exit('Vous avez déjà commandé dans les dernières 24H.');
}
setcookie('commande_envoyee', '1', time() + 86400); // expire dans 24h

if (isset($log[$ip]) && $log[$ip] == $today) {
    exit('Vous avez déjà envoyé une commande aujourd\'hui.');
}

$data = json_decode(file_get_contents('php://input'), true);
$panier = $data['listePanier'] ?? [];

$body = '<h3>Résumé de la commande :</h3><ul>';
foreach ($panier as $item) {
    $body .= '<li>' . htmlspecialchars($item['nom']) . 
            ' — Quantité : ' . (int)$item['quantite'] . 
            ' — Prix : ' . (float)$item['prix'] . ' €</li>';
}
$body .= '</ul>';

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;                                   
    $mail->Username   = 'matzenight@gmail.com';                    
    $mail->Password   = 'azda lajs ipmt mbiy';                            
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         
    $mail->Port       = 587;                                    

    $mail->setFrom('matzenight@gmail.com');
    $mail->addAddress('matheo.pfranger@gmail.com');              

    // Contenu
    $mail->isHTML(true);        
    $mail->CharSet = 'UTF-8';                          
    $mail->Subject = 'Confirmation de commande';
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();
    return true;
} catch (Exception $e) {
    error_log("Erreur lors de l'envoi de l'email : {$mail->ErrorInfo}");  
    return false;
}

$log[$ip] = $today;
file_put_contents($logFile, json_encode($log));

?>