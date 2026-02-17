export default class ToastNotification {
    static show(message, type = 'success') {
        this.hide();

        const toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        toast.style.cssText = 'z-index: 10000; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';

        const icon = type === 'success' ? '✓' : type === 'danger' ? '✗' : 'ⓘ';

        toast.innerHTML = `
           <strong>${icon}</strong> ${message}
           <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(toast);

        // Auto-hide after 3 seconds
        setTimeout(() => this.hide(), 4000);
    }

    // Static Success Method
    static success(message) {
        this.show(message, 'success');
    }

    // Static Error Method
    static error(message) {
        this.show(message, 'danger');
    }

    // Static Info Method
    static info(message) {
        this.show(message, 'info');
    }

    // Static Hide Method
    static hide() {
        const toast = document.getElementById('toast-notification');
        if (toast) toast.remove();
    }
}