<?php
namespace App\Repositories;

use App\Config\Database;
use App\Config\Logger;
use PDO;

class ProductRepository
{
    private PDO $db;
    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Summary of get
     * @param array $filters
     * @return array
     */
    public function get(array $filters = [], ?int $userId = null, ?string $guestId = null)
    {
        $favoriteCondition = $userId ? 'f.user_id = ?' : 'f.guest_id = ? AND f.user_id IS NULL';

        try {
            // Aggiungiamo IF(f.user_id IS NULL, 0, 1) che crea il booleano is_favorite
            $sql = "SELECT p.id, p.image_url, p.bg_image, p.category_id, p.name, p.price, c.name as category_name,
                           IF(f.id IS NULL, 0, 1) as is_favorite
                    FROM products p
                    JOIN categories c ON c.id = p.category_id
                    LEFT JOIN favorites f ON p.id = f.product_id AND $favoriteCondition
                    WHERE p.is_active = 1";

            $params = $userId ? [$userId] : [$guestId];

            // Applichiamo i filtri solo se passati nell'array
            if (!empty($filters['name'])) {
                $sql .= " AND p.name LIKE CONCAT('%', ?, '%')";
                $params[] = $filters['name'];
            }
            if (!empty($filters['category'])) {
                $sql .= " AND c.id = ? ";
                $params[] = $filters['category'];
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            $products = $stmt->fetchAll();
            return $products;

        } catch (\PDOException $e) {
            Logger::error('Error get products', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    public function getTableColumns()
    {
        // Ritorna solo i nomi delle colonne (escludendo id, created_at, ecc.)
        $stmt = $this->db->query("DESCRIBE products");

        return $stmt->fetchAll();
    }

    /**
     * Summary of getById
     * @param int $productId
     */
    public function getById(int $productId, ?int $userId = null, ?string $guestId = null)
    {
        try {
            $sql = "SELECT p.id, p.category_id, p.image_url, p.bg_image, p.name, p.price, p.stock, p.description, c.name as category_name,
                           IF(f.id IS NULL, 0, 1) as is_favorite
                    FROM products p
                    JOIN categories c ON c.id = p.category_id
                    LEFT JOIN favorites f ON p.id = f.product_id 
                         AND (
                                (f.user_id IS NOT NULL AND f.user_id= ?) 
                                OR 
                                (f.user_id IS NULL AND f.guest_id = ?)
                            )
                    WHERE p.id = ? AND p.is_active = 1";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([$userId, $guestId, $productId]);

            $product = $stmt->fetch();
            return $product ?: null;

        } catch (\PDOException $e) {
            Logger::error('Error finding product by id', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of create
     * @param array $datas
     * @return int|null
     */
    public function create(array $datas)
    {
        try {
            // Controllo se esiste già prodotto con SKU
            $stmt = $this->db->prepare("SELECT id FROM products WHERE sku = ?");
            $stmt->execute([$datas['sku']]);

            if ($stmt->fetch()) {
                throw new \Exception("Errore: Un prodotto con questo codice esiste già!");
            }

            // 1. Estraiamo i nomi delle colonne dalle chiavi dell'array
            $columns = implode(', ', array_keys($datas));

            // 2. Creiamo una stringa di segnaposti (es: ?, ?, ?, ?)
            $placeholders = implode(', ', array_fill(0, count($datas), '?'));

            $sql = "INSERT INTO products ($columns) VALUES ($placeholders)";

            $stmt = $this->db->prepare($sql);

            // 3. Passiamo i valori dell'array (esegue l'escape automatico)
            $stmt->execute(array_values($datas));

            $productId = (int) $this->db->lastInsertId();

            Logger::info('Product created', [
                'id' => $productId,
                'name' => $datas['name']
            ]);

            return $productId ?: null;

        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) { // Codice SQL per "Integrity constraint violation"
                Logger::error('Tentativo di inserimento SKU duplicato');
                throw new \Exception("Errore tecnico: Duplicato non permesso.");
            }

            throw $e;
        }
    }

    /**
     * Summary of update
     * @param int $productId
     * @param array $datas
     * @return void
     */
    public function update(int $productId, array $datas)
    {
        try {
            // Trasforma l'array in: ["name = ?", "stock = ?", "description = ?"]
            $fields = array_map(function ($key) {
                return "$key = ?";
            }, array_keys($datas));

            $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);

            // Uniamo l'id finale per il WHERE
            $values = array_values($datas);
            $values[] = $productId;

            $stmt->execute($values);

        } catch (\PDOException $e) {
            Logger::error('Error updated product by id', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of inactivate
     * @param int $productId
     * @return void
     */
    public function inactivate(int $productId)
    {
        try {
            $stmt = $this->db->prepare('
            UPDATE products SET is_active = 0 WHERE id = ?
            ');
            $stmt->execute([$productId]);

            Logger::info('Product inactivated', [
                'id' => $productId,
                'message' => "Product $productId inactivated by Admin"
            ]);

        } catch (\PDOException $e) {
            Logger::error('Error inactivated product by id', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}