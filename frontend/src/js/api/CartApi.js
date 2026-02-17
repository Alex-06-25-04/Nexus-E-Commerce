import FetchApi from './FetchApi.js';

export default class CartApi {
    constructor() {
        this.fetchApi = new FetchApi();
    }

    async getCart() {
        const response = await this.fetchApi.fetch('cart/');

        const cartItems = response.data['cart-items'] || [];

        return {
            items: cartItems.map((cartItem) => this.#transformProduct(cartItem)),
            subtotal: response.data['subtotal'] || 0,
            totalItems: response.data['total-items'] || 0
        }
    }

    #transformProduct(product) {
        const colorMap = {
            1: 'from-purple-600 to-pink-600',   // Audio
            2: 'from-blue-600 to-cyan-600',     // Tech  
            3: 'from-orange-600 to-red-600',    // Fashion
        };

        const subtitleMap = {
            1: 'Premium Audio',
            2: 'Tech Innovation',
            3: 'Fashion Style',
        };

        return {
            ...product,
            color: colorMap[product.category_id] || 'from-gray-600 to-gray-800',
            subtitle: subtitleMap[product.category_id] || 'Premium Product',
        };
    }

    async insertCartItem(productId, quantity) {
        const response = await this.fetchApi.fetch(`cart/${productId}`, {
            method: 'POST',
            body: { quantity }
        });

        return response.cart_item;
    }

    async updateQuantity(productId, quantity) {
        const response = await this.fetchApi.fetch(`cart/${productId}`, {
            method: 'PATCH',
            body: { quantity }
        });

        return response.data;
    }

    async deleteCartItem(productId) {
        return await this.fetchApi.fetch(`cart/${productId}`, {
            method: 'DELETE',
        });
    }

    async checkout() {
        const response = await this.fetchApi.fetch('cart/checkout', {
            method: 'POST',
        });

        return response.data;
    }
}