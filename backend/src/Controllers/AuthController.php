<?php
namespace App\Controllers;

use App\Services\AuthService;
use App\Core\Session;
use App\Core\Request;
use App\Core\Response;
use App\Config\Logger;

class AuthController
{
    private AuthService $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register()
    {
        try {
            $credentials = [
                'name' => Request::input('name'),
                'email' => Request::input('email'),
                'password' => Request::input('password'),
            ];

            $user = $this->authService->registerUser($credentials);

            Response::json([
                'success' => true,
                'data' => $user['user_data']
            ], 201);

        } catch (\Exception $e) {
            Logger::error('Register failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function login()
    {
        try {
            $credentials = [
                'email' => Request::input('email'),
                'password' => Request::input('password'),
                'ip' => Request::ip(),
                'userAgent' => Request::userAgent()
            ];

            $result = $this->authService->loginUser($credentials);

            Response::json([
                'success' => true,
                'message' => 'Login avvenuto con successo',
                'data' => $result
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function checkStatus()
    {
        try {
            if (Session::isLogged()) {
                Response::json([
                    'success' => true,
                    'isLoggedIn' => true,
                    'user_data' => Session::get('user')
                ], 200);
            } else {
                Response::json([
                    'isLoggedIn' => false,
                    'user_data' => Session::getOrCreateGuestId()
                ], 200);
            }

        } catch (\Exception $e) {
            Logger::error('Check Status failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function logout()
    {
        try {
            $this->authService->logout();

            Response::json([
                'success' => true,
                'message' => 'Logout effettuato'
            ], 200);

        } catch (\Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}