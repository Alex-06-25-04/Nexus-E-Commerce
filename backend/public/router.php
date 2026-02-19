<?php
// Router per PHP built-in server (Railway)
// Sostituisce la funzionalità di .htaccess

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Se il file esiste fisicamente, servilo direttamente
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Altrimenti tutto va a index.php
require_once __DIR__ . '/index.php';
