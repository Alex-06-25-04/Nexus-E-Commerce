import FetchApi from './FetchApi.js';

export default class CategoryApi {
    constructor() {
        this.fetchApi = new FetchApi();
    }

    async get() {
        const data = await this.fetchApi.fetch('categories/all');

        return data.categories;
    }

    async getById(id) {
        const data = await this.fetchApi.fetch(`categories/${id}`);

        return data.product;
    }
}