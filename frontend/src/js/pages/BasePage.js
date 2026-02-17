import FooterComponent from '../components/FooterComponent.js';

export default class BasePage {
    constructor(router) {
        this.router = router;

        this.favoriteIds = new Set();
        this.cartItems = new Map();

        this.elements = {
            header: null,
            main: null,
            footer: null,
        }

        this.footerComponent = new FooterComponent();
    }

    render() {
        return `
        <!-- Animated Background -->
        <div class="min-h-screen relative">
    <!-- Background Effects -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
    </div>
    
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/10" id="header-content"></header>
    
    <!-- Main Content -->
    <main class="relative pt-32 pb-20 px-6" id="main-content"></main>

    <!-- Footer -->
    <footer class="relative mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl" id="footer-content"></footer>
</div> 
        `;
    }

    initElements() {
        this.elements.header = document.querySelector('#header-content');
        this.elements.main = document.querySelector('#main-content');
        this.elements.footer = document.querySelector('#footer-content');
    }

    renderHeader() {
        return '';
    }

    renderFooter() {
        this.elements.footer.innerHTML = this.footerComponent.renderFooter();
    }

    renderContent() {
        return '';
    }
}