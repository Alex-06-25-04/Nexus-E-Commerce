<?php
namespace App\Core;

class Response
{
    public static function json(array $messages = [], int $statusCode = 200)
    {
        header('Content-Type: application/json');

        http_response_code($statusCode);

        echo json_encode($messages);

        // Per fermare lo script subito
        exit;
    }
}