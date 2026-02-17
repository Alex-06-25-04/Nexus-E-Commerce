export default class CartSummary {
    constructor({ total, itemsCount }) {
        this.total = total;
        this.itemsCount = itemsCount;
    }

    renderSummary() {
        const total = parseFloat(this.total) || 0;

        const shipping = 0;
        const tax = total * 0.22;
        const finalTotal = (total + tax + shipping).toFixed(2);

        return `
        <div class="cart-summary sticky top-24 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <!-- Dettagli -->
            <h2 class="text-2xl font-black text-white mb-6">Riepilogo Ordine</h2>

            <div class="space-y-3 mb-6">
                <div class="flex justify-between text-white/80">
                    <span>Articoli ${this.itemsCount}</span>
                    <span class="summary-subtotal">€${this.total}</span>
                </div>

                <div class="flex justify-between text-white/80">
                    <span>Spedizione</span>
                    <span class="text-green-400 font-semibold">Gratuita</span>
                </div>

                <div class="flex justify-between text-white/80">
                    <span>IVA (22%)</span>
                    <span class="summary-tax">€${tax.toFixed(2)}</span>
                </div>

                <div class="border-t border-white/10 pt-3"></div>

                <div class="flex justify-between text-white text-xl font-bold">
                    <span>Totale</span>
                    <span class="summary-total bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        €${finalTotal}
                    </span>
                </div>
            </div>

            <!-- Pulsante Checkout -->
            <button 
                type="button"
                id="checkout-btn"
                class="w-full h-14 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-95">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                Procedi al Pagamento
            </button>

            <!-- Metodi di pagamento -->
            <div class="mt-4 flex items-center justify-center gap-3 opacity-60">
                <span class="text-xs text-white">Accettiamo:</span>
                <div class="flex gap-2">
                    <div class="w-8 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                    <div class="w-8 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white">MC</div>
                    <div class="w-8 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-white">PP</div>
                </div>
            </div>
        </div>
        `;
    }
}