import FavoriteApi from '../api/FavoriteApi.js';

export default class FavoriteHandler {
    static api = new FavoriteApi();

    static favoriteIds = new Set();

    // Gestisce il click, la chiamata e l'aggiornamento UI
    static async toggle(productId, iconElement, callback) {
        try {
            const response = await this.api.toggle(productId);

            this.updateUI(iconElement, response);

            // Aggiorna il set globale
            if (response) this.favoriteIds.add(productId);
            else this.favoriteIds.delete(productId);

            if (callback) callback(response);

        } catch (e) {
            console.error('Errore toggle favorite: ', e);
        }
    }

    static updateUI(icon, isFavorite) {
        if (!icon) return;

        if (isFavorite) {
            icon.setAttribute('fill', 'currentColor');
            icon.classList.add('fill-pink-500', 'text-pink-500', 'scale-110');
            icon.classList.remove('text-white');
        } else {
            icon.setAttribute('fill', 'none');
            icon.classList.add('text-white');
            icon.classList.remove('fill-pink-500', 'text-pink-500', 'scale-110');
        }
    }

    // Numero totale dei preferiti
    static count() {
        return this.favoriteIds.size;
    }

    // Ritorna tutti gli ID dei preferiti
    static getAll() {
        return Array.from(this.favoriteIds);
    }
}