import AuthApi from '../api/AuthApi.js';
import CategoryApi from '../api/CategoryApi.js';
import ProductApi from '../api/ProductApi.js';
import FavoriteApi from '../api/FavoriteApi.js';
import CartApi from '../api/CartApi.js';

export default class LoadItemsHandler {
    constructor({
        loadAuth = true,
        loadCategories = true,
        loadProducts = true,
        loadProductsFavorite = false,
        loadCart = false
    } = {}) {
        // 1. SALVA I FLAG (con nomi chiari!)
        this.shouldLoadAuth = loadAuth;
        this.shouldLoadCategories = loadCategories;
        this.shouldLoadProducts = loadProducts;
        this.shouldLoadProductsFavorite = loadProductsFavorite;
        this.shouldLoadCart = loadCart;

        // 2. CREA LE API
        if (this.shouldLoadAuth) this.authApi = new AuthApi();
        if (this.shouldLoadCategories) this.categoryApi = new CategoryApi();
        if (this.shouldLoadProducts) this.productApi = new ProductApi();
        if (this.shouldLoadProductsFavorite) this.favoriteApi = new FavoriteApi();
        if (this.shouldLoadCart) this.cartApi = new CartApi();
    }

    async loadItems(productParams = {}) {
        const params = [];

        // 3. USA I FLAG per decidere cosa caricare
        if (this.shouldLoadAuth) params.push(this.authApi.checkStatus());
        if (this.shouldLoadCategories) params.push(this.categoryApi.get());
        if (this.shouldLoadProducts) params.push(this.productApi.get(productParams));
        if (this.shouldLoadProductsFavorite) params.push(this.favoriteApi.getAll());
        if (this.shouldLoadCart) params.push(this.cartApi.getCart());

        const results = await Promise.all(params);

        // indice che incrementa
        let index = 0;
        // 4. RITORNA I DATI (non sovrascrivere i flag!)
        return {
            auth: this.shouldLoadAuth ? results[index++] : null,
            categories: this.shouldLoadCategories ? results[index++] : null,
            products: this.shouldLoadProducts ? results[index++] : null,
            productsFavorite: this.shouldLoadProductsFavorite ? results[index++] : null,
            cart: this.shouldLoadCart ? results[index++] : null,
        }
    }
}