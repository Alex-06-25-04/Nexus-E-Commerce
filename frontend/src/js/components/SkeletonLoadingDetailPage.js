export default class SkeletonLoading {
    renderLoading() {
        return `<div class="max-w-6xl mx-auto px-4 py-8 animate-pulse">
            <div class="h-10 w-40 bg-white/10 rounded-xl mb-8"></div>

            <div class="grid lg:grid-cols-2 gap-8">
                <div class="aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg class="w-20 h-20 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                <div class="space-y-6">
                    <div class="h-8 w-24 bg-white/10 rounded-full"></div> <div class="h-14 w-3/4 bg-white/10 rounded-2xl"></div> <div class="h-40 w-full bg-white/10 rounded-2xl"></div> <div class="grid grid-cols-2 gap-4">
                        <div class="h-20 bg-white/10 rounded-xl"></div>
                        <div class="h-20 bg-white/10 rounded-xl"></div>
                    </div>

                    <div class="h-24 w-full bg-white/10 rounded-2xl mt-auto"></div> </div>
            </div>
        </div>`;
    }
}
