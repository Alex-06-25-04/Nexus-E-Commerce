import BasePage from './BasePage.js';
import ProductApi from '../api/ProductApi.js';
import CartApi from '../api/CartApi.js';
import HeaderComponent from '../components/HeaderComponent.js';
import LoadItemsHandler from '../utils/LoadItemsHandler.js';
import ToastNotification from '../components/ToastNotification.js';
import ProductList from '../components/ProductList.js';
import SkeletonProductList from '../components/SkeletonProductList.js';
import { attachCardNavigation } from '../utils/attachCardNavigation.js';

export default class HomePage extends BasePage {
    constructor(router) {
        super(router);

        this.load = new LoadItemsHandler(); // Caricamento iniziale
        this.productApi = new ProductApi(); // Caricamento dinamico

        this.username = null;
        this.IsLoggedIn = false
        this.products = [];
        this.productListComponent = null;
        this.headerComponent = null;
        this.categories = [];
        this.currentCategory = 'All';

        this.skeletonComponent = new SkeletonProductList();
    }

    async init() {
        await this.loadItems();
    }

    async loadItems() {
        const items = await this.load.loadItems();

        this.username = items?.auth?.user_data?.username;
        this.isLoggedIn = items?.auth?.isLoggedIn;
        this.categories = [{ id: 'All', name: 'All' }, ...items.categories]; // Aggiungo id: All e name: All così non dà errori visto che nel DB non è presente 
        this.products = items.products;

        this.products.forEach(p => {
            if (p.is_favorite) this.favoriteIds.add(p.id)
        });

        // Verifica se items ha cart e se il numero dentro cart è maggiore di 0
        if (items.cart && items.cart.length > 0) {
            items.cart.forEach(cartItem => this.cartItems.set(cartItem.product_id, cartItem.quantity));
        }
        // Se si iteriamo items.cart(cartItem  => this.cart-items.set(cartItem.product_id, cartItem.quantity))
    }

    // Metodo asincrono al click della categoria
    async #eventClickCategory(catId) {
        if (this.currentCategory === catId) return;

        this.renderSkeletonContent();

        // Inizializzo currentCategory con l'id della categoria per ottenere la categoria corrente
        this.currentCategory = catId;

        const params = (catId && catId === 'All') ? {} : { categoryId: catId };
        this.products = await this.productApi.get(params);

        // Renderizziamo il main in modo che ogni prodotto appartiene alla propria categoria
        this.renderContent();

        this.updateBadgeHeader();

        // Renderizziamo l'header dei buttons
        this.headerComponent.updateCategoryButtons(this.currentCategory);

        await this.renderEvents();
    }

    updateBadgeHeader() {
        // Prendere il numero dei prodotti favoriti
        const favoritesCount = this.favoriteIds.size;

        // Prendere il numero del badge per il carrello preso da cartItems.size
        const cartCount = this.cartItems.size;

        // Chiamare metodo di HeaderComponent per aggiornare il badge
        this.headerComponent.updateBadge('favorites-count', favoritesCount);
        this.headerComponent.updateBadge('cart-count', cartCount);
    }

    renderHeader() {
        this.headerComponent = new HeaderComponent({
            headerContainer: this.elements.header,
            username: this.username,
            isLoggedIn: this.isLoggedIn,
            categories: this.categories,
            currentCategory: this.currentCategory,
            onCategoryClick: async (catId) => {
                try {
                    await this.#eventClickCategory(catId)
                } catch (e) {
                    console.error('Errore nel click delle categorie: ', e);
                    ToastNotification.error('Errore durante il filtro per categoria!');
                }
            },
            router: this.router,
            showSearch: true,
            onSearch: async (valueText) => {
                try {
                    this.currentCategory = 'All';
                    this.products = await this.productApi.get({ searchTerm: valueText });
                    this.renderContent();
                    this.headerComponent.updateCategoryButtons('All');
                } catch (e) {
                    console.error('Errore nel click delle categorie: ', e);
                    ToastNotification.error('Errore durante la ricerca!');
                    this.products = [];
                }
            },
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

    renderSkeletonContent() {
        this.elements.main.innerHTML = this.skeletonComponent.renderLoading(this.products.length || 6);
    }

    renderContent() {
        this.productListComponent = new ProductList({
            products: this.products,
            PagePosition: '/home',
            onVoidClick: (container) => container.addEventListener('click', () => this.router.navigate('/')),
            onFavoriteChanged: (id, isFav) => {
                if (isFav) this.favoriteIds.add(id);
                else this.favoriteIds.delete(id);

                this.updateBadgeHeader();
            },
            // Callback per cartItems onCartItemAdded che chiama l'api 
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
                    this.updateBadgeHeader();

                } catch (e) {
                    console.error('❌ Errore aggiunta carrello:', e);
                    // Potresti mostrare un toast error
                }
            }

            // Stessa logica backend se già nel carrello incrementa di 1 sennò inserisci, tramite api
        });
        this.elements.main.innerHTML = this.productListComponent.renderList();
    }

    async renderEvents() {
        if (this.productListComponent)
            await this.productListComponent.attachEvents();
    }

    async afterRender() {
        this.initElements();
        this.renderSkeletonContent();

        await this.init();
        this.renderHeader();
        this.updateBadgeHeader();
        this.renderContent();
        await this.renderEvents();

        attachCardNavigation(this.router, this.elements.main);

        this.renderFooter();
    }
}