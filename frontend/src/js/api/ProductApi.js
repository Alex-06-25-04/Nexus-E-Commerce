import FetchApi from './FetchApi.js';

export default class ProductApi {
    constructor() {
        this.fetchApi = new FetchApi();
    }

    async get({ categoryId = null, searchTerm = null } = {}) {
        const params = new URLSearchParams();

        if (categoryId) params.append('category', categoryId);
        if (searchTerm) params.append('name', searchTerm);

        let url = 'products/all';
        if (params.toString()) url += `?${params.toString()}`;

        const response = await this.fetchApi.fetch(url);
        return response.data.map(product => this.#transformProduct(product));
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

    async getById(id) {
        const data = await this.fetchApi.fetch(`products/${id}`);

        return this.#transformProduct(data.product);
    }

    async create(data) {
        const response = await this.fetchApi.fetch('products/', {
            method: 'POST',
            body: data
        });

        return response.data;
    }

    async update(id, data) {
        const response = await this.fetchApi.fetch(`products/${id}`, {
            method: 'PUT',
            body: data
        });

        return response.data;
    }

    async delete(id) {
        return await this.fetchApi.fetch(`products/${id}`, {
            method: 'DELETE'
        });
    }
}