import BasePage from './BasePage.js';
import CartApi from '../api/CartApi.js';
import CartItemList from '../components/CartItemList.js';
import LoadItemsHandler from '../utils/LoadItemsHandler.js';
import HeaderComponent from '../components/HeaderComponent.js';

export default class CartPage extends BasePage {
    constructor(router) {
        super(router);

        this.load = new LoadItemsHandler({
            loadCart: true,
            loadProducts: false,
            loadCategories: false
        });
        this.cartApi = new CartApi();
        this.cartItems = [];
        this.cartTotal = 0;

        this.cartListComponent = null;

        this.username = null;
        this.IsLoggedIn = false
    }

    async init() {
        await this.loadItems();
    }

    async loadItems() {
        const items = await this.load.loadItems();

        this.username = items?.auth.user_data?.username;
        this.isLoggedIn = items?.auth?.isLoggedIn;
        this.cartItems = items.cart?.items || [];
        this.cartTotal = items.cart.subtotal;
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
                    url: '/favorites',
                    icon: `<svg class="w-5 h-5 text-white/70 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                           </svg>`,
                    badge: 0, // ← Inizialmente 0
                    badgeId: 'favorites-count' // ← ID univoco per aggiornare
                },
                {
                    type: 'navigate',
                    url: '/',
                    icon: `<svg class="w-5 h-5 text-white/70 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                           </svg>`,
                }
            ],
        });

        this.elements.header.innerHTML = this.headerComponent.renderHeader();
        this.headerComponent.attachEventsHeader();
    }

    renderContent() {
        if (this.cartItems.length === 0) {
            this.elements.main.innerHTML = `
                <div class="void-list max-w-md mx-auto text-center py-20">
                    <div class="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                        <svg class="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-3">Il tuo carrello è vuoto</h3>
                    <p class="text-white/60 mb-6">Aggiungi prodotti per iniziare a fare shopping!</p>
                    <button id="goHome" type="button" class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all">
                        Vai alla Home
                    </button>
                </div>
            `;

            document.querySelector('#goHome')?.addEventListener('click', () => this.router.navigate('/'));
            return;
        }

        this.cartListComponent = new CartItemList({
            cartItems: this.cartItems,
            cartTotal: this.cartTotal,
            onDelete: async (productId) => {
                await this.cartApi.deleteCartItem(productId);
                this.cartItems = this.cartItems.filter(i => i.product_id !== productId);
                this.cartTotal = this.cartItems.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
                this.renderContent();
            },
            onQtyChange: async (productId, delta) => {
                const item = this.cartItems.find(ci => ci.product_id === productId);
                if (!item) return;

                const newQty = item.quantity + delta;
                if (newQty < 1) {
                    await this.cartApi.deleteCartItem(productId);
                    this.cartItems = this.cartItems.filter(ci => ci.product_id !== productId);
                    this.cartTotal = this.cartItems.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
                    this.renderContent();
                    return;
                }

                item.quantity = newQty;
                item.subtotal = (parseFloat(item.price) * newQty).toFixed(2);
                this.cartTotal = this.cartItems.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
                this.cartListComponent.updateItemDisplay(productId, newQty, this.cartTotal);

                // Poi chiama API in background
                await this.cartApi.updateQuantity(productId, newQty);
            },
            onCheckout: async () => {
                try {
                    await this.cartApi.checkout();
                    this.cartItems = [];
                    this.cartTotal = 0;
                    this.renderContent();
                } catch (e) {
                    console.error('Errore checkout:', e);
                }
            }
        });
        this.elements.main.innerHTML = this.cartListComponent.renderList();
        this.cartListComponent.attachCartEvents();
    }

    async afterRender() {
        this.initElements();

        await this.init()

        this.renderHeader();
        this.renderContent();
        this.renderFooter();
    }
}