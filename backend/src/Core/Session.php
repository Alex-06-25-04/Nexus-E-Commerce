<?php
namespace App\Core;

class Session
{
    public static function start()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'domain' => '',
                'secure' => true,
                'httponly' => true,
                'samesite' => 'None'
            ]);
            session_start();
        }
    }

    public static function set(string $key, $value)
    {
        $_SESSION[$key] = $value;
    }

    public static function get(string $key)
    {
        return $_SESSION[$key] ?? null;
    }

    public static function getOrCreateGuestId()
    {
        // Controlla se esiste già in sessione
        if (isset($_SESSION['guest_id'])) {
            return $_SESSION['guest_id'];
        }

        // Crea nuovo guest id
        $guestId = uniqid('guest_', true);
        $_SESSION['guest_id'] = $guestId;

        return $guestId;
    }

    public static function destroy()
    {
        session_destroy();
    }

    public static function isLogged()
    {
        return isset($_SESSION['user']);
    }
}