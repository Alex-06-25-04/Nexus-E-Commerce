import LoadingSpinner from '../components/LoadingSpinner.js';

const API = import.meta.env.VITE_API_URL;

export default class FetchApi {
    constructor() {
        this.spinner = new LoadingSpinner();
    }

    async fetch(endpoint, options = {}) {
        // this.spinner.show();

        // URL
        const url = `${API}/${endpoint}`;

        // CONFIG
        const config = {
            method: options.method || 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        if (options.body && !['GET', 'HEAD'].includes(config.method)) {
            config.body = JSON.stringify(options.body);
        }

        return await this.responseData(url, config);
    }

    async responseData(url, config) {
        try {
            const response = await fetch(url, config);
            if (response.status === 204) return null;

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error('Rispota non JSON: ' + text);
            }

            return await response.json();

        } catch (e) {
            // this.spinner.hide();
            if (e instanceof Error) console.error('API ERROR: ', e.message);
            throw e;
        } finally {
            // this.spinner.hide();
        }
    }
}