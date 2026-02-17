<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap.php';

use App\Repositories\CartRepository;
use App\Config\Database;

// Disabilita output buffering per vedere errori immediatamente
ob_end_clean();
header('Content-Type: text/plain; charset=utf-8');

echo "=== TEST CART REPOSITORY ===\n\n";

// Test 1: Verifica connessione database
echo "1. Test connessione database...\n";
try {
    $db = Database::getInstance();
    echo "✓ Connessione OK\n\n";
} catch (Exception $e) {
    echo "✗ ERRORE: " . $e->getMessage() . "\n";
    exit;
}

// Test 2: Verifica fetch mode
echo "2. Test fetch mode...\n";
$stmt = $db->query("SELECT 1 as test");
$result = $stmt->fetch();
echo "Tipo di array: " . (is_array($result) ? 'array' : 'non array') . "\n";
echo "Keys dell'array: " . implode(', ', array_keys($result)) . "\n";
echo "Ha chiave 'test'? " . (isset($result['test']) ? 'SI' : 'NO') . "\n\n";

// Test 3: Test CartRepository
echo "3. Test CartRepository->getOrCreate()...\n";
$cartRepo = new CartRepository();

// Test con guestId
$guestId = 'test_guest_' . time();
echo "Testing con guestId: $guestId\n";

try {
    $cart = $cartRepo->getOrCreate(null, $guestId);
    
    echo "Risultato getOrCreate:\n";
    echo "Tipo: " . gettype($cart) . "\n";
    if (is_array($cart)) {
        echo "Keys: " . implode(', ', array_keys($cart)) . "\n";
        echo "cart['id']: " . ($cart['id'] ?? 'NON TROVATO') . "\n";
        echo "cart['guest_id']: " . ($cart['guest_id'] ?? 'NON TROVATO') . "\n";
    }
    echo "✓ Test completato\n\n";
    
} catch (Exception $e) {
    echo "✗ ERRORE: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

// Test 4: Verifica se esiste già un cart nella tabella
echo "4. Verifica carts esistenti nella tabella...\n";
$stmt = $db->query("SELECT id, user_id, guest_id, status FROM carts LIMIT 5");
$carts = $stmt->fetchAll();
echo "Numero di carts trovati: " . count($carts) . "\n";
if (count($carts) > 0) {
    echo "Esempio primo cart:\n";
    print_r($carts[0]);
}

echo "\n=== TEST COMPLETATO ===\n";
