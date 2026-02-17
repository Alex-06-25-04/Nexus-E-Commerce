export default class CartItemComponent {
    constructor({ item }) {
        this.item = item;
    }

    renderItem() {
        return `
        <div 
            class="cart-item flex items-center gap-4 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-qhite/10 hover:border-white/20 transition-all group" 
            data-product-id="${this.item.product_id}">
            <div class="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${this.item.color}">
                <img 
                    src="${this.item.bg_image}"
                    alt="${this.item.name}"
                    class="w-full h-full object-contain p-2"
                />
            </div>

            <div class="flex-1 min-w-0">
                <p class="text-xs text-white/60 uppercase tracking-wider mb-1">${this.item.category_name || ' Product'}</p>
                <h3 class="text-lg font-bold text-white mb-1 truncate">${this.item.name}</h3>
                <p class="text-sm text-white/80">€${this.item.price}</p>
            </div>

            <div class="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <button 
                        type="button" 
                        class="qty-decrease w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white font-bold"
                        data-product-id="${this.item.product_id}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"/>
                    </svg>
                </button>

                <span class="qty-value text-lg font-bold text-white min-w-[2rem] text-center">${this.item.quantity}</span>

                <button 
                        type="button" 
                        class="qty-increase w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white font-bold"
                        data-product-id="${this.item.product_id}"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>

            <div class="text-right min-w-[100px]">
                <p class="text-xs text-white/60 mb-1">Subtotale</p>
                <p class="item-subtotal text-2xl font-black bg-gradient-to-r ${this.item.color} bg-clip-text text-transparent">
                    €${this.item.subtotal}
                </p>
            </div>

            <button 
                type="button"
                class="delete-cart-item w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center text-red-400 hover:text-red-300"
                data-product-id="${this.item.product_id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
            </button>
        </div>
        `;
    }
}