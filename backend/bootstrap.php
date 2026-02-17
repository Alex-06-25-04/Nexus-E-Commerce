<?php
use Dotenv\Dotenv;
use App\Core\Session;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

Session::start();

// Default headers API
header('Content-Type: application/json; charset=utf-8');

// CORS per frontend SPA
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Gestione preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Timezone
date_default_timezone_set($_ENV['APP_TIMEZONE']);