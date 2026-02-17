<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "TEST 1: Autoload<br>";
require_once __DIR__ . '/../vendor/autoload.php';
echo "✓ Autoload OK<br>";

echo "TEST 2: Bootstrap<br>";
require_once __DIR__ . '/../bootstrap.php';
echo "✓ Bootstrap OK<br>";

echo "TEST 3: Database Connection<br>";
try {
    $db = \App\Config\Database::getInstance();
    echo "✓ Database Connected<br>";
} catch (Exception $e) {
    echo "✗ Database Error: " . $e->getMessage() . "<br>";
}

echo "TEST 4: Routes<br>";
require_once __DIR__ . '/../routes/web.php';
