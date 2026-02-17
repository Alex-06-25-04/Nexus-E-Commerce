import FetchApi from './FetchApi.js';

export default class AuthApi {
    constructor() {
        this.fetchApi = new FetchApi();
    }

    async register(data) {
        const response = await this.fetchApi.fetch('auth/register', {
            method: 'POST',
            body: data
        });

        return response.data;
    }

    async login(data) {
        const response = await this.fetchApi.fetch('auth/login', {
            method: 'POST',
            body: data
        });

        return response.data;
    }

    async checkStatus() {
        return await this.fetchApi.fetch('auth/check');
    }

    async logout() {
        await this.fetchApi.fetch('auth/logout', {
            method: 'POST'
        });

        localStorage.clear();
        window.location.href = '/login';
    }
}