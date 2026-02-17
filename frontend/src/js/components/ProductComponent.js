export default class ProductComponent {
    constructor({ product, className, showActions, page }) {
        this.product = product;
        this.showActions = showActions;
        this.className = className;
        this.page = page;
    }

    // Renderizza il layer di sfondo
    #renderBackground() {
        return `
            <div class="absolute inset-0 z-0">
                <img
                    src="${this.product.image_url}"
                    alt="${this.product.name}"
                    class="w-full h-full object-cover opacity-40 brightness-90"
                />
                <div class="absolute inset-0 bg-gradient-to-t ${this.product.color} mix-blend-multiply opacity-70"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>
        `;
    }

    // Pulsante preferito
    #renderFavoriteButton() {
        const isFavorite = this.product.is_favorite;
        return `
            <button type="button" 
                    data-product-id="${this.product.id}" 
                    class="toggle-favorite p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                <svg class="heart-icon w-5 h-5 transition-all ${isFavorite ? 'fill-pink-500 text-pink-500 scale-110' : 'text-white'}" 
                    fill="${isFavorite ? 'currentColor' : 'none'}" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        `;
    }

    // Menu azioni (per la pagina favorites)
    #renderMenuButton() {
        return `
            <div class="relative">
            <button type="button"
                    data-id="${this.product.id}"
                    class="menu-trigger p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </button>

            <div class="dropdown-menu hidden absolute top-full right-0 mt-2 w-48 text-center cursor-pointer bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                <ul class="py-2 text-sm text-white/90">
                    <li class="delete-fav" px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors text-red-400">
                        Elimina
                    </li>
                </ul>
            </div>
        </div>
        `;
    }

    // Renderizza le azioni in alto a destra
    #renderTopActions() {
        return `
            <div class="absolute top-5 left-5 right-5 flex items-start justify-between z-20">
                <div class="w-10"></div>
                ${this.showActions ? this.#renderMenuButton() : this.#renderFavoriteButton()}
            </div>
        `;
    }

    // Renderizza l'immagine del prodotto
    #renderProductImage() {
        return `
            <div class="h-[280px] flex items-center justify-center px-8 pt-16 pb-4">
                <img
                    src="${this.product.bg_image}"
                    alt="${this.product.name}"
                    class="max-w-full max-h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                />
            </div>
        `;
    }

    // Renderizza il pulsante principale (varia in base alla pagina)
    #renderActionButton() {
        const iconSVG = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        `;

        return `
            <button type="button" 
                    class="w-full h-12 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${this.product.color} hover:scale-[1.02] active:scale-95 hover:shadow-2xl shadow-lg"
                    id="addToCart-${this.product.id}">
                ${iconSVG}
                Aggiungi al Carrello
            </button>
        `;
    }

    // Renderizza le informazioni del prodotto
    #renderProductInfo() {
        return `
            <div class="h-[240px] flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-xl">
                
                <!-- Category Badge -->
                <p class="text-[0.7rem] font-bold text-white/70 mb-2 tracking-widest uppercase leading-tight">
                    ${this.product.category_name}
                </p>

                <!-- Product Name -->
                <h3 class="text-xl font-black text-white mb-3 line-clamp-2 leading-tight h-[3.5rem]">
                    ${this.product.name}
                </h3>

                <!-- Price -->
                <div class="mb-3">
                    <p class="text-3xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        €${this.product.price}
                    </p>
                </div>

                <!-- Action Button -->
                ${this.#renderActionButton()}
            </div>
        `;
    }

    // Renderizza la card completa
    renderCard() {
        return `
        <article class="product-card group" data-product-id="${this.product.id}">
            <div class="relative h-[520px] rounded-3xl ${this.className} bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-purple-500/30 border border-white/5 hover:border-white/20">
                
                ${this.#renderBackground()}

                <!-- Content Container -->
                <div class="relative z-10 h-full flex flex-col">
                    
                    ${this.#renderTopActions()}
                    
                    ${this.#renderProductImage()}

                    ${this.#renderProductInfo()}

                    <!-- Animated Border -->
                    <div class="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-white/30 transition-all duration-500 pointer-events-none"></div>
                </div>
            </div>
        </article>
        `;
    }
}