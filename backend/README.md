<?php
namespace App\Services;

use App\Config\Database;
use App\Config\Logger;
use PDO;

class AuditService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Traccia un'azione dell'utente nell'audit trail
     * 
     * @param int|null $userId - ID utente (null per guest)
     * @param string $action - Tipo di azione (es: 'login', 'order_placed')
     * @param string|null $entityType - Tipo di risorsa (es: 'product', 'order')
     * @param int|null $entityId - ID della risorsa
     * @param array|null $oldValue - Valore precedente (opzionale)
     * @param array|null $newValue - Nuovo valore (opzionale)
     */
    public function log(
        ?int $userId,
        string $action,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $oldValue = null,
        ?array $newValue = null
    ) {
        try {
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

            $stmt = $this->db->prepare('
                INSERT INTO user_logs 
                (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ');

            $stmt->execute([
                $userId,
                $action,
                $entityType,
                $entityId,
                $oldValue ? json_encode($oldValue) : null,
                $newValue ? json_encode($newValue) : null,
                $ip,
                $userAgent
            ]);

            // Log anche su file per ridondanza
            Logger::info("Audit: $action", [
                'user_id' => $userId,
                'entity' => $entityType ? "$entityType:$entityId" : null
            ]);

        } catch (\PDOException $e) {
            // NON bloccare l'applicazione se il log fallisce
            Logger::error('Audit log failed', [
                'action' => $action,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Recupera i log di un utente specifico
     */
    public function getUserLogs(int $userId, int $limit = 100)
    {
        try {
            $stmt = $this->db->prepare('
                SELECT action, entity_type, entity_id, ip_address, created_at
                FROM user_logs
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT ?
            ');
            $stmt->execute([$userId, $limit]);

            return $stmt->fetchAll();

        } catch (\PDOException $e) {
            Logger::error('Error fetching user logs', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Recupera log sospetti (troppi failed login, ecc.)
     */
    public function getSuspiciousActivity(int $minutes = 60, int $threshold = 5)
    {
        try {
            $stmt = $this->db->prepare('
                SELECT user_id, ip_address, COUNT(*) as attempts
                FROM user_logs
                WHERE action = "failed_login"
                AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
                GROUP BY user_id, ip_address
                HAVING attempts >= ?
                ORDER BY attempts DESC
            ');
            $stmt->execute([$minutes, $threshold]);

            return $stmt->fetchAll();

        } catch (\PDOException $e) {
            Logger::error('Error fetching suspicious activity', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}




import BasePage from './BasePage.js';
import AuthApi from '../api/AuthApi.js';
import ToastNotification from '../components/ToastNotification.js';

export default class AuthPage extends BasePage {
    constructor(router) {
        super(router);
        this.authApi = new AuthApi();
        this.isLogin = true; // true = login, false = register
    }

    renderContent() {
        this.elements.main.innerHTML = `
            <!-- Background Gradient Animato -->
            <div class="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900 -z-10">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0tMiAwdi0ySDMydjJoMnptMi0ydjJoMnYtMmgtMnptMCAwdi0yaC0ydjJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            </div>

            <div class="min-h-screen flex items-center justify-center px-4 py-12">
                <!-- Auth Container -->
                <div class="w-full max-w-md">
                    
                    <!-- Logo Header -->
                    <div class="text-center mb-8">
                        <h1 class="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-3">
                            ✦ NEXUS
                        </h1>
                        <p class="text-white/60 text-lg">Benvenuto nel futuro dello shopping</p>
                    </div>

                    <!-- Auth Card -->
                    <div class="relative group">
                        <!-- Animated Border -->
                        <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                        
                        <!-- Card Content -->
                        <div class="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                            
                            <!-- Toggle Tabs -->
                            <div class="flex gap-2 mb-8 p-1 bg-white/5 rounded-2xl backdrop-blur-xl">
                                <button type="button" id="tab-login" class="tab-btn flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${this.isLogin ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}">
                                    Login
                                </button>
                                <button type="button" id="tab-register" class="tab-btn flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!this.isLogin ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-white/60 hover:text-white'}">
                                    Registrati
                                </button>
                            </div>

                            <!-- Form -->
                            <form id="auth-form" class="space-y-5">
                                
                                <!-- Username Field (only for register) -->
                                <div id="username-field" class="space-y-2 ${this.isLogin ? 'hidden' : ''}">
                                    <label class="block text-sm font-semibold text-white/80">
                                        Username
                                    </label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <i class="bi bi-person text-white/40"></i>
                                        </div>
                                        <input 
                                            type="text" 
                                            id="username" 
                                            name="username"
                                            placeholder="Il tuo username"
                                            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all backdrop-blur-xl"
                                        />
                                    </div>
                                </div>

                                <!-- Email Field -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-semibold text-white/80">
                                        Email
                                    </label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <i class="bi bi-envelope text-white/40"></i>
                                        </div>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            placeholder="nome@esempio.com"
                                            required
                                            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all backdrop-blur-xl"
                                        />
                                    </div>
                                </div>

                                <!-- Password Field -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-semibold text-white/80">
                                        Password
                                    </label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <i class="bi bi-lock text-white/40"></i>
                                        </div>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all backdrop-blur-xl"
                                        />
                                        <button type="button" id="toggle-password" class="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors">
                                            <i class="bi bi-eye" id="eye-icon"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Forgot Password (only for login) -->
                                <div id="forgot-password" class="text-right ${!this.isLogin ? 'hidden' : ''}">
                                    <a href="#" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                                        Password dimenticata?
                                    </a>
                                </div>

                                <!-- Submit Button -->
                                <button 
                                    type="submit" 
                                    id="submit-btn"
                                    class="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50">
                                    <span id="btn-text">${this.isLogin ? 'Accedi' : 'Crea Account'}</span>
                                    <i class="bi bi-arrow-right ml-2"></i>
                                </button>

                                <!-- Alternative Actions -->
                                <div class="text-center text-sm text-white/60">
                                    ${this.isLogin 
                                        ? 'Non hai un account? <button type="button" id="switch-to-register" class="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Registrati ora</button>'
                                        : 'Hai già un account? <button type="button" id="switch-to-login" class="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Accedi</button>'
                                    }
                                </div>
                            </form>

                            <!-- Divider -->
                            <div class="relative my-8">
                                <div class="absolute inset-0 flex items-center">
                                    <div class="w-full border-t border-white/10"></div>
                                </div>
                                <div class="relative flex justify-center text-sm">
                                    <span class="px-4 bg-black/60 text-white/40">Oppure continua con</span>
                                </div>
                            </div>

                            <!-- Social Login -->
                            <div class="grid grid-cols-3 gap-3">
                                <button type="button" class="social-btn p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-xl">
                                    <i class="bi bi-google text-white text-xl"></i>
                                </button>
                                <button type="button" class="social-btn p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-xl">
                                    <i class="bi bi-facebook text-white text-xl"></i>
                                </button>
                                <button type="button" class="social-btn p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-xl">
                                    <i class="bi bi-apple text-white text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Back to Home -->
                    <div class="text-center mt-8">
                        <button type="button" id="back-to-home" class="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                            <i class="bi bi-arrow-left"></i>
                            <span>Torna alla Home</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const form = document.getElementById('auth-form');
        const togglePassword = document.getElementById('toggle-password');
        const eyeIcon = document.getElementById('eye-icon');
        const passwordInput = document.getElementById('password');
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        const backToHome = document.getElementById('back-to-home');

        // Toggle Password Visibility
        togglePassword?.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            eyeIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });

        // Tab Switching
        const switchTab = (isLogin) => {
            this.isLogin = isLogin;
            this.renderContent();
            this.attachEvents();
        };

        tabLogin?.addEventListener('click', () => switchTab(true));
        tabRegister?.addEventListener('click', () => switchTab(false));
        switchToRegister?.addEventListener('click', () => switchTab(false));
        switchToLogin?.addEventListener('click', () => switchTab(true));

        // Form Submit
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const btnText = document.getElementById('btn-text');
            const originalText = btnText.textContent;
            
            submitBtn.disabled = true;
            btnText.textContent = 'Caricamento...';

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                if (this.isLogin) {
                    await this.authApi.login(data.email, data.password);
                    ToastNotification.success('Login effettuato con successo!');
                } else {
                    await this.authApi.register(data.username, data.email, data.password);
                    ToastNotification.success('Registrazione completata!');
                }

                // Redirect to home
                setTimeout(() => this.router.navigate('/'), 500);

            } catch (error) {
                console.error('Auth error:', error);
                ToastNotification.error(error.message || 'Errore durante l\'autenticazione');
                btnText.textContent = originalText;
            } finally {
                submitBtn.disabled = false;
            }
        });

        // Back to Home
        backToHome?.addEventListener('click', () => {
            this.router.navigate('/');
        });
    }

    async afterRender() {
        this.initElements();
        this.renderContent();
        this.attachEvents();
    }
}