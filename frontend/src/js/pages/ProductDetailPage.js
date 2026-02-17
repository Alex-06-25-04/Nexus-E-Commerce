import BasePage from './BasePage.js';
import ProductDetailComponent from '../components/ProductDetailComponent.js';
import HeaderComponent from '../components/HeaderComponent.js';
import FooterComponent from '../components/FooterComponent.js';
import ProductApi from '../api/ProductApi.js';
import SkeletonLoadingDetailPage from '../components/SkeletonLoadingDetailPage.js'; // ← GIÀ ESISTE

export default class ProductDetailPage extends BasePage {
    constructor(router, productId) {
        super(router);
        this.productApi = new ProductApi();

        this.productId = productId;
        this.product = null;

        this.skeletonComponent = new SkeletonLoadingDetailPage();
    }

    async init() {
        const response = await this.productApi.getById(this.productId);

        this.product = response;
    }

    renderHeader() {
        const header = new HeaderComponent({
            headerContainer: this.elements.header,
            onCategoryClick: [],
            categories: [],
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
                    url: '/cart',
                    icon: `<svg class="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>`,
                    badge: 0, // ← Inizialmente 0
                    badgeId: 'cart-count' // ← ID univoco per aggiornare
                }
            ],
        });

        this.elements.header.innerHTML = header.renderHeader();
        header.attachEventsHeader();
    }

    renderSkeletonContent() {
        this.elements.main.innerHTML = this.skeletonComponent.renderLoading(6);
    }

    renderContent() {
        const productCard = new ProductDetailComponent({
            product: this.product,
            onVoidClick: () => this.router.navigate('/')
        });
        this.elements.main.innerHTML = productCard.renderProduct();
        productCard.attachEvents();
    }

    renderFooter() {
        const footerComponent = new FooterComponent();
        this.elements.footer.innerHTML = footerComponent.renderFooter();
    }

    async afterRender() {
        this.initElements();
        this.renderHeader();
        this.renderSkeletonContent();

        this.renderFooter();
        try {
            // 2. Carica i dati in background
            await this.init();

            // 3. Sovrascrivi lo Skeleton con i dati veri del prodotto
            this.renderContent();
        } catch (error) {
            console.error("Errore caricamento prodotto:", error);
            this.elements.main.innerHTML = `<p class="text-white text-center">Prodotto non trovato.</p>`;
        }
    }
}