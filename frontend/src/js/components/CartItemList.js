import CartSummary from '../components/CartSummary.js';
import CartItemComponent from '../components/CartItemComponent.js';

export default class CartItemList {
    constructor({
        cartItems,
        cartTotal,
        onDelete,        // ← Callback da CartPage
        onQtyChange,     // ← Callback da CartPage
        onCheckout
    }) {
        this.cartItems = cartItems;
        this.cartTotal = cartTotal;
        this.onDelete = onDelete;
        this.onQtyChange = onQtyChange;
        this.onCheckout = onCheckout;
    }

    renderList() {
        return `
        <div class="max-w-7xl mx-auto px-6 py-12">
            <h1 class="text-4xl font-black text-white mb-8">Il Tuo Carrello</h1>
                
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Lista items (2/3 larghezza) -->
                <div class="lg:col-span-2 space-y-4" id="cart-items-container">
                    ${this.cartItems.map(item => {
            const cartItem = new CartItemComponent({ item });
            return cartItem.renderItem();
        }).join('')}
                </div>

                <!-- Summary (1/3 larghezza) -->
                <div class="lg:col-span-1">
                    ${new CartSummary({
            total: this.cartTotal,
            itemsCount: this.cartItems.length
        }).renderSummary()}
                </div>
            </div>
        </div>
        `;
    }

    attachCartEvents() {
        const container = document.querySelector('#cart-items-container');
        if (!container) return;

        container.addEventListener('click', async (e) => {
            // Elimina item
            const deleteBtn = e.target.closest('.delete-cart-item');
            if (deleteBtn) {
                const productId = Number(deleteBtn.dataset.productId);
                if (this.onDelete) await this.onDelete(productId);
                return;
            }

            // Diminuisci quantità
            const decreaseQty = e.target.closest('.qty-decrease');
            if (decreaseQty) {
                const productId = Number(decreaseQty.dataset.productId);
                if (this.onQtyChange) await this.onQtyChange(productId, -1);
                return;
            }

            // Aumenta quantità
            const increaseQty = e.target.closest('.qty-increase');
            if (increaseQty) {
                const productId = Number(increaseQty.dataset.productId);
                if (this.onQtyChange) await this.onQtyChange(productId, +1);
                return;
            }
        });

        // Pulsante checkout
        document.querySelector('#checkout-btn')?.addEventListener('click', async () => {
            if (this.onCheckout) await this.onCheckout();
        });
    }

    updateItemDisplay(productId, newQty, newTotal) {
        const itemEl = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (!itemEl) return;

        const item = this.cartItems.find(ci => ci.product_id === productId);

        itemEl.querySelector('.qty-value').textContent = newQty;

        const newSubtTotal = (parseFloat(item.price) * newQty).toFixed(2);

        itemEl.querySelector('.item-subtotal').textContent = `€${newSubtTotal}`;

        const tax = parseFloat(newTotal * 0.22).toFixed(2);
        const finalTotal = (newTotal + parseFloat(tax)).toFixed(2);

        document.querySelector('.summary-subtotal').textContent = `€${newTotal.toFixed(2)}`;
        document.querySelector('.summary-tax').textContent = `€${tax}`;
        document.querySelector('.summary-total').textContent = `€${finalTotal}`;
    }
}