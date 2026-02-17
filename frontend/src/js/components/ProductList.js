import ProductCardComponent from './ProductComponent.js';
import FavoriteHandler from '../utils/FavoriteHandler.js';

/**
 * @param {Array<Object>} products
 * @param {boolean} showActions
 */

export default class ProductList {
    constructor({
        products,
        emptyMessage,
        showActions,
        PagePosition,
        onVoidClick,
        onDeleteFav,
        onDeleteCartItem,
        onFavoriteChanged,
        onCartItemAdded,
        className,
        router
    }) {
        this.products = products ?? [];
        this.emptyMessage = emptyMessage;
        this.showActions = showActions ?? false;
        this.PagePosition = PagePosition;
        this.onVoidClick = onVoidClick;
        this.onDeleteFav = onDeleteFav;
        this.onDeleteCartItem = onDeleteCartItem;
        this.onFavoriteChanged = onFavoriteChanged;
        this.onCartItemAdded = onCartItemAdded;
        this.className = className;
        this.router = router;

        this.cartButtonTimeouts = new Map();
    }

    #getCardStyleClass() {
        return this.PagePosition === '/favorites'
            ? 'overflow-visible'
            : 'overflow-hidden';
    }

    renderList() {
        if (this.products.length === 0) {
            return `
            <div class="void-list max-w-md mx-auto text-center py-20">
                <div class="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                    <svg class="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>

                <h3 class="text-2xl font-bold text-white mb-3">${this.emptyMessage || (
                    this.PagePosition === '/home'
                        ? 'Nessun prodotto al momento!'
                        : this.PagePosition === '/favorites'
                            ? 'Nessun prodotto nei preferiti!'
                            : ''
                )}
                </h3>
                ${this.PagePosition === '/favorites' || this.PagePosition === '/cart'
                    ? `<p class="text-white/60 mb-6">Aggiungi prodotti per iniziare a fare shopping!</p>
                       <button id="goHome" type="button" class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all">Vai alla Home</button>`
                    : ''
                }
            </div>
            `;
        }

        return `
       <div class="product-list relative max-w-7xl mx-auto px-6 pb-29">
            <div class="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                ${this.products.map((product) => {
            const productCardComponent = new ProductCardComponent({
                product,
                className: this.#getCardStyleClass(),
                showActions: this.showActions,
                page: this.PagePosition
            });
            return productCardComponent.renderCard();
        }).join('')}
            </div>
        </div>
        `;
    }

    async attachEvents() {
        const container = document.querySelector('#goHome');
        if (this.onVoidClick && container) this.onVoidClick(container);

        // for (const product of this.products) {
        //     const card = new ProductCardComponent({ product, showActions: this.showActions });
        //     await card.afterRender();
        // }

        // Event Delagation
        const listContainer = document.querySelector('.product-list');
        if (!listContainer) return;

        // Event Delegation
        listContainer.addEventListener('click', async (e) => {
            // ========================================
            // 1. DELETE - DEVE ESSERE IL PRIMO!
            // ========================================{
            const deleteBtn = e.target.closest('.delete-fav');
            if (deleteBtn) {
                e.stopPropagation();
                console.log('🔴 DELETE CLICKED!'); // Debug

                const card = deleteBtn.closest('.product-card');
                const productId = Number(card.dataset.productId);

                console.log('🔴 Product ID:', productId); // Debug

                if (!productId) {
                    console.log('❌ Product ID non trovato!');
                    return;
                }

                // Nascondi il dropdown prima di eliminare
                const dropdown = deleteBtn.closest('.dropdown-menu');
                if (dropdown) dropdown.classList.add('hidden');

                try {
                    // Chiama il callback per eliminare dal backend
                    if (this.onDeleteFav) {
                        console.log('🔴 Chiamata API eliminazione...'); // Debug
                        await this.onDeleteFav(productId);
                        console.log('✅ Eliminazione completata'); // Debug
                    }

                    // Filtra il prodotto dall'array
                    this.products = this.products.filter(p => p.id !== productId);

                    // Rimuovi la card dal DOM
                    card.remove();

                    // Se non ci sono più prodotti, mostra messaggio vuoto
                    if (this.products.length === 0) {
                        listContainer.innerHTML = this.renderList();
                        await this.attachEvents();
                    }
                } catch (error) {
                    console.error('❌ Errore eliminazione:', error);
                }
                return;
            }

            // ========================================
            // 2. GESTIONE PREFERITI
            // ========================================
            const favoriteBtn = e.target.closest('.toggle-favorite');
            if (favoriteBtn) {
                e.stopPropagation();

                if (favoriteBtn.disabled) return;
                favoriteBtn.disabled = true;

                const icon = favoriteBtn.querySelector('.heart-icon');
                const productId = favoriteBtn.dataset.productId;
                const product = this.products.find(p => p.id == productId);

                const oldValue = product.is_favorite;
                product.is_favorite = !oldValue;

                FavoriteHandler.updateUI(icon, product.is_favorite);
                if (this.onFavoriteChanged) this.onFavoriteChanged(product.id, product.is_favorite);

                try {
                    const confirmedStatus = await FavoriteHandler.api.toggle(productId);
                    product.is_favorite = confirmedStatus;

                    if (confirmedStatus !== !oldValue) {
                        FavoriteHandler.updateUI(icon, confirmedStatus);
                        if (this.onFavoriteChanged) this.onFavoriteChanged(product.id, confirmedStatus);
                    }
                } catch (e) {
                    console.error('Errore nel toggle dei preferiti: ', e);
                    product.is_favorite = oldValue;
                    FavoriteHandler.updateUI(icon, product.is_favorite);
                    if (this.onFavoriteChanged) this.onFavoriteChanged(product.id, oldValue);
                } finally {
                    favoriteBtn.disabled = false;
                }

                return;
            }

            // ========================================
            // 3. AGGIUNGI AL CARRELLO
            // ========================================
            const addToCartBtn = e.target.closest('button[id^="addToCart"]');
            if (addToCartBtn) {
                e.stopPropagation();
                const productId = addToCartBtn.id.replace('addToCart-', '');

                addToCartBtn.disabled = true;

                if (this.cartButtonTimeouts.has(productId)) {
                    clearTimeout(this.cartButtonTimeouts.get(productId));
                }

                try {
                    if (this.onCartItemAdded) await this.onCartItemAdded(productId);

                    addToCartBtn.textContent = '✓ Aggiunto';

                    const timeoutId = setTimeout(() => {
                        addToCartBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Aggiungi al Carrello
                `;
                        this.cartButtonTimeouts.delete(productId);
                    }, 1500);

                    this.cartButtonTimeouts.set(productId, timeoutId);
                } catch (e) {
                    console.error('Errore nell\'aggiunta del prodotto al carrello', e);
                } finally {
                    addToCartBtn.disabled = false;
                }

                return;
            }

            // ========================================
            // 4. MENU DROPDOWN (TRE PUNTINI)
            // DEVE ESSERE DOPO delete-fav!
            // ========================================
            const menuTrigger = e.target.closest('.menu-trigger');
            if (menuTrigger) {
                e.stopPropagation();

                // ✅ Il dropdown è ora sibling del button, non child
                const menuContainer = menuTrigger.parentElement;
                const dropdownMenu = menuContainer.querySelector('.dropdown-menu');

                console.log('🟡 Menu trigger clicked, dropdown:', dropdownMenu);

                this.#toggleDropdown(dropdownMenu);

                return;
            }
        });
    }

    #toggleDropdown(dropdownMenu) {
        if (dropdownMenu) dropdownMenu.classList.toggle('hidden');
    }
}