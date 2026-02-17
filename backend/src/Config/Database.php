<?php
namespace App\Config;

use PDO;
use PDOException;

use App\Config\Logger;

/**
 *  Classe Database per connettereci al DB
 */
class Database
{
    // Inizializziamo l'instanza, privata, di PDO, per ora null
    private static ?PDO $instance = null;

    // Metodo statico getInstance per instanziare e creare una nuova connessione PDO
    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            try {
                $host = $_ENV['DB_HOST'];
                $db = $_ENV['DB_DATABASE'];
                $port = $_ENV['DB_PORT'];
                $user = $_ENV['DB_USERNAME'];
                $pass = $_ENV['DB_PASSWORD'];
                $charset = 'utf8mb4';

                $dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];

                self::$instance = new PDO($dsn, $user, $pass, $options);

            } catch (PDOException $e) {
                Logger::error('Database connection failed', [
                    'error' => $e->getMessage()
                ]);

                throw new PDOException('Errore di connessione al database');
            }
        }

        return self::$instance;
    }
}