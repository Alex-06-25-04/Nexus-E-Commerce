<?php
namespace App\Core;

class Request
{
    private static ?array $jsonData = null;

    private static function getJsonData()
    {
        if (self::$jsonData === null) {
            $raw_input = file_get_contents('php://input', true);
            self::$jsonData = json_decode($raw_input, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                self::$jsonData = [];
            }
        }

        return self::$jsonData;
    }

    /**
     * Request Body for text
     * @param string $key
     * @param mixed $default
     */
    public static function input(string $key, $default = null)
    {
        // Prova prima JSON, poi fallback a $_POST
        $data = self::getJsonData();
        return $data[$key] ?? $_POST[$key] ?? $default;
    }

    public static function all(array $values = [])
    {
        // Uniamo JSON e POST
        $data = array_merge(self::getJsonData(), $_POST);
        if (!empty($data)) {
            // Restituisci solo le chiavi autorizzate
            return array_intersect_key($data, array_flip($values));
        }

        return $data;
    }

    /**
     * Request body for file [image]
     * @param string $key
     * @return void
     */
    public static function file(string $key)
    {
        return $_FILES[$key] ?? null;
    }

    /**
     * Method for verify 
     * @param string $key
     * @return bool
     */
    public static function isImageOldVersion(string $key)
    {
        // Prendo il metodo file
        $file = self::file($key);

        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        // 1. APERTURA (finfo_open)
        // Specifichiamo che vogliamo il MIME TYPE (es: image/png)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);

        // 2. ANALISI (finfo_file)
        // Passiamo il percorso temporaneo del file ricevuto dalla SPA
        $mime = finfo_file($finfo, $file['tmp_name']);

        // 3. CHIUSURA (finfo_close)
        // Liberiamo le risorse
        finfo_close($finfo);

        // Controlla se il tipo MIME inizia con "image/"
        return strpos($mime, 'image/') === 0;
    }

    public static function isImage(string $key)
    {
        $file = self::file($key);

        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);

        $mime = $finfo->file($file['tmp_name']);
        // Non serve chiudere esplicitamente, lo fa PHP quando l'oggetto viene distrutto.

        return strpos($mime, 'image/') === 0;
    }

    public static function params(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    public function method()
    {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }

    public static function ip()
    {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public static function userAgent()
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }
}