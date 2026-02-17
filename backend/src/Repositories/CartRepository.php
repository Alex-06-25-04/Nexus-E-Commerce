<?php
namespace App\Repositories;

use App\Config\Database;
use App\Config\Logger;
use PDO;

class CartRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Ottenere o creare il carrello in base all'utente autenticato o al guest
     */
    public function getOrCreate($userId = null, $guestId = null)
    {
        $fields = $userId !== null ? 'user_id' : 'guest_id';
        $values = $userId ?? $guestId;

        try {
            $stmt = $this->db->prepare("
            SELECT id, user_id, guest_id, status
            FROM carts
            WHERE {$fields} = ?
        ");
            $stmt->execute([$values]);

            $cart = $stmt->fetch(PDO::FETCH_ASSOC);  // ← AGGIUNGI PDO::FETCH_ASSOC

            if (!$cart) {
                $stmt = $this->db->prepare('
                INSERT INTO carts (user_id, guest_id) VALUES (?, ?)
            ');
                $stmt->execute([$userId, $guestId]);

                $cartId = $this->db->lastInsertId();

                return [
                    'id' => (int) $cartId,  // ← CAST A INT
                    'user_id' => $userId,
                    'guest_id' => $guestId
                ];
            }

            return $cart;

        } catch (\PDOException $e) {
            Logger::error('Error finding or creating cart', [
                'user_id' => $userId,
                'guest_id' => $guestId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Ottenere i cart items tramite l'id del carrello corrispondente
     */
    public function getCartItems(int $cartId)
    {
        try {
            $stmt = $this->db->prepare('
           SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.created_at,
                  pr.name, pr.image_url, pr.bg_image, pr.price, pr.category_id,
                  c.name as category_name,
                  (pr.price * ci.quantity) AS subtotal
           FROM cart_items ci
           JOIN products pr ON pr.id = ci.product_id
           JOIN categories c ON c.id = pr.category_id
           WHERE ci.cart_id = ?
           ORDER BY ci.created_at DESC
            ');
            $stmt->execute([$cartId]);

            return $stmt->fetchAll();

        } catch (\PDOException $e) {
            Logger::error('Error get cart items', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Trovare il cart item tramite cartId e productId
     */
    public function findCartItem(int $cartId, int $productId)
    {
        try {
            $stmt = $this->db->prepare('
            SELECT id, cart_id, product_id, quantity 
            FROM cart_items 
            WHERE cart_id = ? AND product_id = ?
            ');
            $stmt->execute([$cartId, $productId]);

            return $stmt->fetch(PDO::FETCH_ASSOC);

        } catch (\PDOException $e) {
            Logger::error('Error get cart items', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Inserire il nuovo cart item nel carrello con cartId, productId e quantità
     */
    public function insertCartItem(int $cartId, int $productId, int $quantity)
    {
        try {
            $stmt = $this->db->prepare('
            INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
            ');
            $stmt->execute([$cartId, $productId, $quantity]);

            return $this->db->lastInsertId();

        } catch (\PDOException $e) {
            Logger::error('Error insert cart items', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function calculateTotal(int $cartId)
    {
        try {
            $stmt = $this->db->prepare('
            SELECT ci.id, SUM(pr.price * ci.quantity) AS subtotal 
            FROM cart_items ci
            JOIN products pr ON pr.id = ci.product_id
            WHERE ci.cart_id = ?
            ');
            $stmt->execute([$cartId]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            // Se il carrello è vuoto, SUM restituisce null
            return $result['subtotal'] ?? 0;

        } catch (\PDOException $e) {
            Logger::error('Error insert cart items', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Modificare la quantità del cart item tramite cartId, productId e appunto quantity
     */
    public function updateQuantity(int $cartId, int $productId, int $quantity)
    {
        try {
            if ($quantity >= 1) {  // ← Rimosso check inutile su $productId
                $stmt = $this->db->prepare('
            UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?
            ');
                $stmt->execute([$quantity, $cartId, $productId]);

                return $stmt->rowCount() > 0;
            } else {
                // Elimina se quantity <= 0
                $this->deleteCartItem($cartId, $productId);
                return true;  // ← AGGIUNTO RETURN!
            }

        } catch (\PDOException $e) {
            Logger::error('Error update quantity', [
                'cart_id' => $cartId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Svuotare il carrello dopo il checkout
     */
    public function clearItems(int $cartId)
    {
        try {
            $stmt = $this->db->prepare('
            DELETE FROM cart_items WHERE cart_id = ?
            ');
            $stmt->execute([$cartId]);

        } catch (\PDOException $e) {
            Logger::error('Error clear cart items', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Eliminare il cart item dal carrello dal cartId e productId
     */
    public function deleteCartItem(int $cartId, int $productId)
    {
        try {
            $stmt = $this->db->prepare('
            DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?
            ');
            $stmt->execute([$cartId, $productId]);

        } catch (\PDOException $e) {
            Logger::error('Error delete cart item', [
                'cart_id' => $cartId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}