<?php
namespace App\Repositories;

use App\Config\Database;
use App\Config\Logger;
use PDO;

class CategoryRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAll()
    {
        try {
            $stmt = $this->db->query("SELECT id, name, slug FROM categories");
            return $stmt->fetchAll();

        } catch (\PDOException $e) {
            Logger::error('Error get categories', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function getById(int $catId)
    {
        try {
            $stmt = $this->db->prepare('
                SELECT id, name, slug FROM categories 
                WHERE id = ?
                LIMIT 1
            ');
            $stmt->execute([$catId]);

            $cat = $stmt->fetch();

            return $cat ?: null;

        } catch (\PDOException $e) {
            Logger::error('Error get category', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}