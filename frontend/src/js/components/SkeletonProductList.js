export default class SkeletonProductList {
    renderLoading(count = 6) {
        return `
        <div class="relative max-w-7xl mx-auto px-6 pb-29">
            <div class="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                ${Array(count).fill(0).map(() => this.renderCard()).join('')}
            </div>
        </div>`;
    }

    renderCard() {
        return `
        <div class="animate-pulse">
            <div class="relative h-[520px] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                <!-- Top buttons skeleton -->
                <div class="absolute top-5 left-5 right-5 flex items-start justify-between z-20">
                    <div class="w-10 h-10"></div>
                    <div class="w-10 h-10 bg-white/10 rounded-2xl"></div>
                </div>
                
                <!-- Product Image skeleton -->
                <div class="h-[280px] flex items-center justify-center px-8 pt-16 pb-4">
                    <div class="w-48 h-48 bg-white/10 rounded-full"></div>
                </div>

                <!-- Product Info skeleton -->
                <div class="h-[240px] flex flex-col justify-end p-5 bg-gradient-to-t from-black/95 to-transparent">
                    <!-- Category -->
                    <div class="h-3 w-24 bg-white/10 rounded-full mb-2"></div>
                    
                    <!-- Product Name -->
                    <div class="mb-3 space-y-2">
                        <div class="h-5 w-full bg-white/10 rounded-lg"></div>
                        <div class="h-5 w-3/4 bg-white/10 rounded-lg"></div>
                    </div>

                    <!-- Price -->
                    <div class="h-8 w-32 bg-white/10 rounded-lg mb-3"></div>

                    <!-- Button -->
                    <div class="h-12 w-full bg-white/10 rounded-xl"></div>
                </div>
            </div>
        </div>`;
    }
}