<?php
namespace App\Repositories;

use App\Config\Database;
use App\Config\Logger;
use PDO;
class UserRepository
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Summary of findByEmail
     * @param string $email
     */
    public function findByEmail(string $email)
    {
        try {
            $stmt = $this->db->prepare('
            SELECT id, name, email, password, role
            FROM users
            WHERE email = ?
            LIMIT 1
            ');
            $stmt->execute([$email]);

            $user = $stmt->fetch();
            return $user ?: null; // Elvis operator (Equivalente a ? user : null)

        } catch (\PDOException $e) {
            Logger::error('Error finding user by email', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of create
     * @param array $credentials
     * @return int
     */
    public function create(array $credentials)
    {
        try {
            $stmt = $this->db->prepare('
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            ');
            $stmt->execute([
                $credentials['name'],
                $credentials['email'],
                password_hash($credentials['password'], PASSWORD_BCRYPT)
            ]);

            $userId = (int) $this->db->lastInsertId();

            Logger::info('User created', [
                'id' => $userId,
                'email' => $credentials['email']
            ]);

            return $userId;

        } catch (\PDOException $e) {
            Logger::error('Error creating user', [
                'email' => $credentials['email'],
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of findById
     * @param int $userId
     */
    public function findById(int $userId)
    {
        try {
            $stmt = $this->db->prepare('
            SELECT id, name, email, role
            FROM USERS
            WHERE id = ?
            LIMIT 1
            ');
            $stmt->execute([$userId]);

            $user = $stmt->fetch();
            return $user ?: null;

        } catch (\PDOException $e) {
            Logger::error('Error select user', [
                'id' => $userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of userLogs
     * @param mixed $userId
     * @param string $action
     * @param string $ip
     * @param string $userAgent
     * @return void
     */
    public function userLogs(?int $userId, string $action, string $ip, string $userAgent)
    {
        try {
            $stmt = $this->db->prepare('
            INSERT INTO user_logs (user_id, action, ip_address, user_agent)
            VALUES (?, ?, ?, ?)
            ');
            $stmt->execute([$userId, $action, $ip, $userAgent]);

        } catch (\PDOException $e) {
            Logger::error('Error logging user action', [
                'user_id' => $userId,
                'action' => $action,
                'error' => $e->getMessage()
            ]);
        }
    }
}