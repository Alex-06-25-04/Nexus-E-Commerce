<?php
namespace App\Repositories;

use App\Config\Database;
use App\Config\Logger;
use PDO;
class FavoriteRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function exists(?int $userId, ?string $guestId, int $productId)
    {
        $stmt = $this->db->prepare("SELECT id FROM favorites 
                                           WHERE product_id = ? 
                                           AND (
                                           (user_id IS NOT NULL AND user_id = ?)
                                           OR
                                           (user_id IS NULL AND guest_id = ?)
                                           )"
        );
        $stmt->execute([$productId, $userId, $guestId]);

        return (bool) $stmt->fetch();
    }

    public function getAll(?int $userId, ?string $guestId)
    {
        $stmt = $this->db->prepare("SELECT p.id, p.name, p.image_url, p.bg_image, p.description, p.category_id, p.price, p.stock
                                           FROM products p
                                           JOIN categories c on c.id = p.category_id
                                           JOIN favorites f ON p.id = f.product_id
                                           WHERE (f.user_id IS NOT NULL AND f.user_id = ?)
                                                 OR
                                                 (f.user_id IS NULL AND f.guest_id = ?)"
        );
        $stmt->execute([$userId, $guestId]);

        return $stmt->fetchAll();
    }

    public function insert(?int $userId, ?string $guestId, int $productId)
    {
        $stmt = $this->db->prepare("INSERT INTO favorites (user_id, guest_id, product_id) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $guestId, $productId]);

        return $this->db->lastInsertId();
    }

    public function delete(?int $userId, ?string $guestId, int $productId)
    {
        $stmt = $this->db->prepare("DELETE FROM favorites 
                                           WHERE product_id = ? 
                                           AND (
                                           (user_id IS NOT NULL AND user_id = ?) 
                                           OR 
                                           (user_id IS NULL AND guest_id = ?)
                                           )"
        );
        $stmt->execute([$productId, $userId, $guestId]);
    }
}