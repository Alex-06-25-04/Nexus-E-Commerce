import FetchApi from './FetchApi.js';

export default class FavoriteApi {
    constructor() {
        this.fetchApi = new FetchApi()
    }

    async toggle(productId) {
        const response = await this.fetchApi.fetch('favorites/toggle', {
            method: 'POST',
            body: { product: productId }
        });
        console.log('Toggle response:', response);
        return response.data.is_favorite;
    }

    async getAll() {
        const favorites = await this.fetchApi.fetch('favorites/all');

        return favorites.data.favorites.map(product => this.#transformProduct(product));
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
        }
    }

    async delete(productId) {
        return await this.fetchApi.fetch(`favorites/${productId}`, {
            method: 'DELETE'
        });
    }
}