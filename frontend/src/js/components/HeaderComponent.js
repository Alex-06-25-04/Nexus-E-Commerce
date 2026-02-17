import AuthApi from '../api/AuthApi.js';

export default class HeaderComponent {
    constructor({
        headerContainer,
        username,
        isLoggedIn,
        categories,
        currentCategory,
        onCategoryClick,
        router,
        showSearch,
        onSearch,
        actions
    }) {
        this.headerContainer = headerContainer;
        this.username = username;
        this.isLoggedIn = isLoggedIn;
        this.categories = categories || [];
        this.currentCategory = currentCategory;
        this.onCategoryClick = onCategoryClick;
        this.router = router;
        this.showSearch = showSearch;

        this.onSearch = onSearch;
        this.actions = actions || [];

        this.authApi = new AuthApi();
    }

    renderHeader() {
        return `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <!-- Desktop Layout -->
        <div class="hidden lg:flex items-center justify-between gap-6">
            <!-- Left: Logo -->
            <div class="flex-shrink-0">
                ${this.#renderTitle()}
            </div>

            <!-- Center: Search + Categories -->
            <div class="flex-1 flex items-center gap-6 justify-center max-w-3xl">
                ${this.showSearch ? this.#renderSearch() : ''}
                
                <nav class="category-buttons flex items-center gap-2">
                    ${this.#renderCategories()}
                </nav>
            </div>

            <!-- Right: Actions -->
            <div class="flex-shrink-0">
                ${this.#renderActions()}
            </div>
        </div>

        <!-- Mobile Layout -->
        <div class="lg:hidden">
            <!-- Top Row: Logo + Actions -->
            <div class="flex items-center justify-between mb-4">
                ${this.#renderTitle()}
                <div class="flex items-center gap-2">
                    ${this.#renderActions()}
                </div>
            </div>

            <!-- Bottom Row: Search -->
            ${this.showSearch ? `
            <div class="mb-3">
                ${this.#renderSearch()}
            </div>
            ` : ''}

            <!-- Categories Scroll -->
            <div class="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                <nav class="category-buttons flex items-center gap-2 min-w-max">
                    ${this.#renderCategories()}
                </nav>
            </div>
        </div>
    </div>
        `;
    }

    #renderTitle() {
        return `
           <h1 id="principal-title" 
            class="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform whitespace-nowrap" 
            title="Home Page">
            ✦ NEXUS
        </h1>
        `;
    }

    #renderSearch() {
        return `
         <div class="relative w-full lg:max-w-md">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <input 
            type="search"  
            placeholder="Cerca prodotti..." 
            class="searchbar w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all backdrop-blur-xl"
        />
    </div>
        `;
    }

    #renderCategories() {
        return `
            ${this.categories.map(cat => this.#renderCat(cat)).join('')}
        `;
    }

    #renderCat(cat) {
        const isActive = this.currentCategory == cat.id;

        return `
        <button class="btn-cat group relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 
        ${isActive
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'}"
            data-cat-id="${cat.id}" 
            type="button">
            ${cat.name}
            ${isActive ? `
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                ` : ''}
        </button>
        `;
    }

    updateCategoryButtons(category) {
        // Inizializziamo currentCategory con la categoria cliccata
        this.currentCategory = category;

        // Prendiamo il contenitore dei category-buttons
        const catButtons = document.querySelector('.category-buttons');
        if (catButtons) {
            // Renderizziamo le categorie
            catButtons.innerHTML = this.#renderCategories();
        }
    }

    #renderActions() {
        return `
        <div class="header-actions flex items-center gap-3">
            <!-- User Info -->
            <div class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-purple-500/20 hover:border-purple-500/50">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <i class="bi bi-person-fill text-white text-sm"></i>
                </div>
                ${this.isLoggedIn
                ? `<span class="text-sm font-semibold text-white">${this.username}</span>`
                : '<span class="btn-login text-sm font-semibold text-white cursor-pointer">Accedi</span>'}
            </div>

            ${this.actions.map(action => this.#renderButton(action)).join('')}

            ${this.isLoggedIn
                ? `
                    <button class="btn-logout group px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all backdrop-blur-xl">
                        <i class="bi bi-box-arrow-right text-white/70 group-hover:text-red-400 transition-colors"></i> Logout
                    </button>
                `
                : ''}
        </div>
        `;
    }

    #renderButton(action) {
        return `
        <button class="btn-action relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-xl group" 
        data-action="${action.type}" 
        data-url="${action.url || ''}" >
            ${action.icon} 
            <span class="absolute -top-1 -right-1 hidden bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" id="${action.badgeId}">${action.badge}</span>
        </button>
        `;
    }

    updateBadge(badgeId, count) {
        if (!badgeId) return;

        const badge = document.querySelector(`#${badgeId}`);
        if (!badge) return;

        if (count > 0) {
            badge.classList.remove('hidden');
            badge.textContent = count;
        } else {
            badge.classList.add('hidden');
        }
    }

    attachEventsHeader() {
        if (!this.headerContainer) return;

        let timeout;
        // Ricerca dinamica (delegation)
        this.headerContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('searchbar')) {
                const value = e.target.value.trim();

                clearTimeout(timeout);
                timeout = setTimeout(() => this.onSearch(value), 500);
            }
        });

        // Click handlers
        this.headerContainer.addEventListener('click', async (e) => {
            // Categories
            const catBtn = e.target.closest('.btn-cat');
            if (catBtn) {
                const catId = catBtn.dataset.catId;
                if (this.onCategoryClick) await this.onCategoryClick(catId);
                return;
            }

            // Actions
            const actionBtn = e.target.closest('.btn-action');

            if (actionBtn) {
                const { action, url } = actionBtn.dataset;
                if (action === 'navigate' && url) this.router.navigate(url);
                return;
            }

            // Login
            if (e.target.closest('.btn-login')) {
                this.router.navigate('/auth');
                return;
            }

            // Logout
            if (e.target.closest('.btn-logout')) {
                this.authApi.logout();
                return;
            }

            // Logo click -> Home
            if (e.target.closest('#principal-title')) {
                this.router.navigate('/');
                return
            }
        });
    }
}