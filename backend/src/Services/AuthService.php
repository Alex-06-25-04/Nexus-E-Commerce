<?php
namespace App\Services;

use App\Repositories\UserRepository;
use App\Config\Logger;
use App\Exceptions\AuthenticationException;
use App\Core\Session;

class AuthService
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Summary of registerUser
     * @param array $credentials
     * @throws \Exception
     * @return array{user_data: array{email: mixed, id: int, name: mixed}}
     */
    public function registerUser(array $credentials)
    {
        if (empty($credentials['name']) || empty($credentials['email']) || empty($credentials['password'])) {
            Logger::warning('Register failed - empty fields', [
                'email' => $credentials['email']
            ]);

            throw new \Exception('I campi sono obbligatori!');
        }

        if (!filter_var($credentials['email'], FILTER_VALIDATE_EMAIL)) {
            Logger::warning('Register failed - invalid email', [
                'email' => $credentials['email']
            ]);

            throw new \Exception('Email non valida');
        }

        try {
            $user = $this->userRepository->findByEmail($credentials['email']);
            if ($user) {
                Logger::warning('Register failed - duplicate email', [
                    'email' => $credentials['email']
                ]);

                throw new \Exception('Email già esistente');
            }

            $newUserId = $this->userRepository->create($credentials);

            $newUser = $this->userRepository->findById($newUserId);
            if (!$newUser) {
                Logger::warning('Register failed - invalid credentials', [
                    'email' => $credentials['email']
                ]);

                throw new \Exception('Errore nella registrazione');
            }

            return [
                'user_data' => [
                    'id' => $newUserId,
                    'name' => $newUser['name'],
                    'email' => $newUser['email'],
                ]
            ];

        } catch (\Exception $e) {
            Logger::error('Register error', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Summary of loginUser
     * @param array $credentials
     * @throws AuthenticationException
     * @return array{user: array{email: mixed, id: mixed, username: mixed}}
     */
    public function loginUser(array $credentials)
    {
        if (empty($credentials['email']) || empty($credentials['password'])) {
            Logger::warning('Login failed - empty fields', ['email' => $credentials['email']]);

            throw new AuthenticationException('Email e password obbligatorie');
        }

        if (!filter_var($credentials['email'], FILTER_VALIDATE_EMAIL)) {
            Logger::warning('Login failed - invalid email', ['email' => $credentials['email']]);

            throw new AuthenticationException('Email non valida');
        }

        try {
            $user = $this->userRepository->findByEmail($credentials['email']);
            if (!$user) {
                Logger::warning('Login failed - invalid credentials', ['email' => $credentials['email']]);

                throw new AuthenticationException('Credenziali non valide');
            }

            if (!password_verify($credentials['password'], $user['password'])) {
                Logger::warning('Login failed - invalid credentials', ['email' => $credentials['email']]);

                throw new AuthenticationException('Credenziali non valide');
            }

            Session::set('user', [
                'id' => $user['id'],
                'username' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]);

            Logger::info('Login success', ['user_id' => $user['id'], 'email' => $user['email'], 'ip' => $credentials['ip']]);

            $this->userRepository->userLogs($user['id'], 'login', $credentials['ip'], $credentials['userAgent']);

            return Session::get('user');

        } catch (\Exception $e) {
            Logger::error('Login error', [
                'email' => $credentials['email'],
                'error' => $e->getMessage()
            ]);

            throw new AuthenticationException('Errore interno');
        }
    }

    /**
     * Summary of logout
     * @return void
     */
    public function logout()
    {
        $user = Session::get('user');

        if ($user)
            Logger::info('User Logout', ['id' => $user['id']]);

        Session::destroy();
    }
}