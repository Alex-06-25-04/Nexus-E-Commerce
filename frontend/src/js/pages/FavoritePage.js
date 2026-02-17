import BasePage from './BasePage.js';
import LoadItemsHandler from '../utils/LoadItemsHandler.js';
import HeaderComponent from '../components/HeaderComponent.js';
import ProductList from '../components/ProductList.js';
import FavoriteApi from '../api/FavoriteApi.js';
import { attachCardNavigation } from '../utils/attachCardNavigation.js';
import CartApi from '../api/CartApi.js';

export default class FavoritePage extends BasePage {
    constructor(router) {
        super(router);

        this.load = new LoadItemsHandler({ loadProductsFavorite: true, loadProducts: false, loadCategories: false });

        this.products = [];
        this.productListComponent = null;
        this.headerComponent = null;
        this.username = null;
        this.isLoggedIn = null;
    }

    async init() {
        await this.loadItems();
    }

    async loadItems() {
        const items = await this.load.loadItems();

        this.username = items?.auth.user_data?.name;
        this.isLoggedIn = items.auth?.isLoggedIn;
        this.products = items.productsFavorite;
    }

    renderHeader() {
        this.headerComponent = new HeaderComponent({
            headerContainer: this.elements.header,
            username: this.username,
            isLoggedIn: this.isLoggedIn,
            router: this.router,
            actions: [
                {
                    type: 'navigate',
                    url: '/',
                    icon: `<svg class="w-5 h-5 text-white/70 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                           </svg>`,
                },
                {
                    type: 'navigate',
                    url: '/cart',
                    icon: `<svg class="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>`,
                    badge: 0, // ← Inizialmente 0
                    badgeId: 'cart-count' // ← ID univoco per aggiornare
                }
            ],
        });
        this.elements.header.innerHTML = this.headerComponent.renderHeader();
        this.headerComponent.attachEventsHeader();
    }

    renderContent() {
        this.productListComponent = new ProductList({
            products: this.products,
            PagePosition: '/favorites',
            showActions: true,
            onVoidClick: (container) => container.addEventListener('click', () => this.router.navigate('/')),
            onDeleteFav: async (productId) => {
                const favApi = new FavoriteApi();

                try {
                    await favApi.delete(productId);
                } catch (e) {
                    console.error('Errore nella rimozione del prodotto dai preferiti', e);
                }
            },
            onCartItemAdded: async (productId) => {
                const cartApi = new CartApi();

                try {
                    // Il backend gestisce automaticamente se esiste già!
                    await cartApi.insertCartItem(productId, 1);
                    console.log('✅ Prodotto aggiunto/incrementato');

                    // Aggiorna lo stato locale
                    if (this.cartItems.has(productId)) {
                        const currentQty = this.cartItems.get(productId);
                        this.cartItems.set(productId, currentQty + 1);
                        console.log('🟢 Qty incrementata a:', currentQty + 1);
                    } else {
                        this.cartItems.set(productId, 1);
                        console.log('🟢 Nuovo prodotto, qty: 1');
                    }

                    console.log('🔵 Badge update, cartItems.size:', this.cartItems.size);

                } catch (e) {
                    console.error('❌ Errore aggiunta carrello:', e);
                    // Potresti mostrare un toast error
                }
            }
        });

        this.elements.main.innerHTML = this.productListComponent.renderList();
    }

    async renderEvents() {
        if (this.productListComponent) await this.productListComponent.attachEvents();
    }

    async afterRender() {
        this.initElements();
        await this.init();

        this.renderHeader();
        this.renderContent();
        this.renderFooter();

        await this.renderEvents();

        attachCardNavigation(this.router, this.elements.main)
    }
}