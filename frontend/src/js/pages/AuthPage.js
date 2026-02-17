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
                                        Nome
                                    </label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <i class="bi bi-person text-white/40"></i>
                                        </div>
                                        <input 
                                    type="text" 
                                    id="name" 
                                    name="name"
                                    placeholder="Il tuo nome"
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
        const form = document.querySelector('#auth-form');
        if (!form) return;

        const togglePassword = document.querySelector('#toggle-password');
        const eyeIcon = document.querySelector('#eye-icon');
        const passwordInput = document.querySelector('#password');
        const tabLogin = document.querySelector('#tab-login');
        const tabRegister = document.querySelector('#tab-register');
        const switchToRegister = document.querySelector('#switch-to-register');
        const switchToLogin = document.querySelector('#switch-to-login');
        const backToHome = document.querySelector('#back-to-home');

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

        switchToLogin?.addEventListener('click', () => switchTab(true));
        switchToRegister?.addEventListener('click', () => switchTab(false));

        // Form Submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.querySelector('#submit-btn');
            const btnText = document.querySelector('#btn-text');

            const originalText = btnText.textContent;

            submitBtn.disabled = true;
            btnText.textContent = 'Caricamento...';

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                if (this.isLogin) {
                    await this.authApi.login(data);
                    ToastNotification.success('Login effettuato con successo!');
                } else {
                    await this.authApi.register(data);
                    ToastNotification.success('Registrazione completata!');
                }

                // Redirect to home
                setTimeout(() => this.router.navigate('/'), 500);

            } catch (e) {
                console.error('Auth error:', e);
                ToastNotification.error(e.message || 'Errore durante l\'autenticazione');
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