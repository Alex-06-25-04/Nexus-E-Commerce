<?php
namespace App\Config;

use Monolog\Logger as MonologLogger; // Logger → decide cosa loggare
use Monolog\Handler\RotatingFileHandler;

class Logger
{
    private static ?MonologLogger $instance = null;

    public static function getInstance(): MonologLogger
    {
        if (self::$instance === null) {
            self::$instance = new MonologLogger('e-commerce');

            // Log su file (rotazione giornaliera)
            // Aggiungi un gestore di log che scrive su file rotativi
            $logPath = __DIR__ . '/../../logs/app.log';
            self::$instance->pushHandler(
                new RotatingFileHandler($logPath, 30, MonologLogger::DEBUG)
            );
        }

        return self::$instance;
    }

    public static function info(string $message, array $context = [])
    {
        self::getInstance()->info($message, $context);
    }

    public static function warning(string $message, array $context = [])
    {
        self::getInstance()->warning($message, $context);
    }

    public static function error(string $message, array $context = [])
    {
        self::getInstance()->error($message, $context);
    }


    public static function debug(string $message, array $context = [])
    {
        self::getInstance()->debug($message, $context);
    }


    public static function critical(string $message, array $context = [])
    {
        self::getInstance()->critical($message, $context);
    }
}