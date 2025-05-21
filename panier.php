<?php
session_start();
header('Content-Type: application/json');

if ($_POST['action'] === 'ajouter') {
    $id = $_POST['id'];
    if (!isset($_SESSION['panier'])) {
        $_SESSION['panier'] = [];
    }
    $_SESSION['panier'][] = $id;
    echo json_encode($_SESSION['panier']);
}

if ($_POST['action'] === 'voir') {
    echo json_encode($_SESSION['panier'] ?? []);
}
