<?php
use Dotenv\Dotenv;
use App\Core\Session;

// Carica .env solo se esiste (in locale), su Railway le variabili sono già nel sistema
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

Session::start();

// Default headers API
header('Content-Type: application/json; charset=utf-8');

// CORS per frontend SPA
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    getenv('FRONTEND_URL') ?: ''
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Gestione preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Timezone
date_default_timezone_set(getenv('APP_TIMEZONE') ?: 'Europe/Rome');
