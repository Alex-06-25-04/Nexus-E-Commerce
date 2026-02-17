// import AuthPage from '../pages/AuthPage.js';
import HomePage from '../pages/HomePage.js';
import ProductDetailPage from '../pages/ProductDetailPage.js';
import FavoritePage from '../pages/FavoritePage.js';
import CartPage from '../pages/CartPage.js';

const routes = {
    '/': HomePage,
    '/favorites': FavoritePage,
    '/cart': CartPage,
    // '/auth': AuthPage
};

export default class Router {
    constructor() {
        this.app = document.getElementById('app');
    }

    init() {
        window.addEventListener('popstate', () => this.route());
        this.route();
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.route();
    }

    async route() {
        let path = window.location.pathname;
        let PageClass = routes[path];
        const match = path.match(/^\/products\/(\d+)$/);
        let pageInstance;

        if (match) {
            pageInstance = new ProductDetailPage(this, match[1]);
        } else {
            PageClass = PageClass || routes['/'];
            pageInstance = new PageClass(this);
        }

        // 1. RENDERIZZA SUBITO (Senza aspettare i dati)
        // Questo cambia istantaneamente l'URL e la visuale
        this.app.innerHTML = pageInstance.render();

        // 2. AVVIA L'INIZIALIZZAZIONE (Dati + Logica dopo il render)
        if (pageInstance.afterRender) {
            await pageInstance.afterRender();
        }
    }
}