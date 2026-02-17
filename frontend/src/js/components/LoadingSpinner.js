export default class LoadingSpinner {
    show(message = 'Carcamento...') {
        // Se esiste, nascondi
        this.hide();

        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner-overlay';
        spinner.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center';
        spinner.style.cssText = 'background: rgba(0, 0, 0, 0.5); z-index: 9999;';

        spinner.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="text-white mt-3 fw-bold">${message}</div>
        </div>
        `;

        document.body.appendChild(spinner);
    }

    hide() {
        const spinner = document.getElementById('loading-spinner-overlay');
        if (spinner) spinner.remove();
    }
}