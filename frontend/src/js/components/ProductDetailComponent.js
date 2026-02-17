import FavoriteHandler from '../utils/FavoriteHandler.js';
import SkeletonLoadingDetailPage from '../components/SkeletonLoadingDetailPage.js'
export default class ProductDetailComponent {
    constructor({ product, onVoidClick }) {
        this.product = product;
        this.onVoidClick = onVoidClick;
    }

    renderProduct() {
        if (!this.product) return new SkeletonLoadingDetailPage().renderLoading();

        const isFavorite = this.product.is_favorite;

        return `
     <div class="max-w-6xl mx-auto px-4">
        <!-- Back Button -->
        <button id="back-button" class="mb-8 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl active:scale-95">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="font-semibold">Torna indietro</span>
        </button>

        <!-- Product Detail Grid -->
        <div class="grid lg:grid-cols-2 gap-8">
            
            <!-- Left: Product Image -->
            <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br ${this.product.color} shadow-2xl">
                <!-- Background -->
                <div class="absolute inset-0">
                    <img
                        src="${this.product.bg_image}"
                        alt="${this.product.name}"
                        class="w-full h-full object-cover opacity-30"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                <!-- Product Image -->
                <div class="relative aspect-square flex items-center justify-center p-12">
                    <img
                        src="${this.product.image_url}"
                        alt="${this.product.name}"
                        class="max-w-full max-h-full object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-700"
                    />
                </div>

                <!-- Favorite Button -->
                <button type="button" 
                        id="toggle-favorite" 
                        class="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 hover:bg-black/60 transition-all hover:scale-110 active:scale-95">
                    <svg id="heart-icon" 
                         class="w-6 h-6 transition-all ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'}" 
                         fill="${isFavorite ? 'currentColor' : 'none'}" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <!-- Right: Product Info -->
            <div class="flex flex-col justify-between gap-8">
                <!-- Info Section -->
                <div class="space-y-6">
                    <!-- Category Badge -->
                    <span class="inline-block px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r ${this.product.color} text-white shadow-lg">
                        ${this.product.subtitle}
                    </span>

                    <!-- Product Name -->
                    <h1 class="text-5xl font-black text-white leading-tight">
                        ${this.product.name}
                    </h1>

                    <!-- Description - GRANDE, CHIARA, LEGGIBILE! -->
                    <div class="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-xl">
                        <p class="text-xl font-semibold text-white leading-relaxed">
                            ${this.product.description || 'Prodotto premium di alta qualità. Design innovativo e prestazioni eccezionali per un\'esperienza senza compromessi.'}
                        </p>
                    </div>

                    <!-- Specs Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <p class="text-sm text-white/50 mb-1">Disponibilità</p>
                            <p class="text-lg font-bold text-white">
                                ${this.product.stock > 0 ? `${this.product.stock} unità` : 'Esaurito'}
                            </p>
                        </div>
                        <div class="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <p class="text-sm text-white/50 mb-1">Categoria</p>
                            <p class="text-lg font-bold text-white">${this.product.subtitle}</p>
                        </div>
                    </div>
                </div>

                <!-- Price & Actions -->
                <div class="space-y-4">
                    <!-- Price Box -->
                    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                        <p class="text-sm text-white/50 mb-2">Prezzo</p>
                        <p class="text-5xl font-black bg-gradient-to-r ${this.product.color} bg-clip-text text-transparent">
                            €${this.product.price}
                        </p>
                    </div>

                    <!-- Add to Cart Button -->
                    <button type="button" 
                            id="addToCart"
                            class="w-full py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r ${this.product.color} hover:scale-[1.02] active:scale-95 hover:shadow-2xl shadow-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Aggiungi al Carrello
                    </button>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    attachEvents() {
        // Favorite toggle
        const toggleFavorite = document.querySelector('#toggle-favorite');
        const heartIcon = document.querySelector('#heart-icon');

        if (toggleFavorite.disabled) return;

        toggleFavorite?.addEventListener('click', async () => {
            const oldValue = this.product.is_favorite;
            this.product.is_favorite = !oldValue;

            FavoriteHandler.updateUI(heartIcon, this.product.is_favorite);

            toggleFavorite.disabled = true;

            try {
                await FavoriteHandler.toggle(this.product.id, heartIcon, (confirmedStatus) => {
                    this.product.is_favorite = confirmedStatus;
                });
            } catch (e) {
                this.product.is_favorite = oldValue;
                FavoriteHandler.updateUI(heartIcon, this.product.is_favorite);
            } finally {
                toggleFavorite.disabled = false;
            }
        });

        // Back Button Event
        document.querySelector('#back-button')?.addEventListener('click', () => {
            if (this.onVoidClick) this.onVoidClick();
        });
    }
}