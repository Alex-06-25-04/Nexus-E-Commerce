// ============================================
// ESEMPI DI UTILIZZO AUDITSERVICE
// ============================================

// 1. LOGIN
public function login(array $credentials)
{
    try {
        $user = $this->userRepository->findByEmail($credentials['email']);
        
        if (!$user || !password_verify($credentials['password'], $user['password'])) {
            // LOG FAILED LOGIN
            $this->auditService->log(
                null,                    // user_id (null perché login fallito)
                'failed_login',
                null,
                null
            );
            throw new AuthenticationException('Credenziali non valide');
        }

        Session::set('user', [...]);

        // LOG SUCCESSFUL LOGIN
        $this->auditService->log(
            $user['id'],
            'login'
        );

        return Session::get('user');
    }
}
