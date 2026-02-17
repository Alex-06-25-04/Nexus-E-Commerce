export const attachCardNavigation = (router, mainContainer) => {
    if (!mainContainer) return;

    mainContainer.addEventListener('click', (e) => {
        if (e.target.closest('.toggle-favorite')) return;
        if (e.target.closest('button[id^="addToCart"]')) return;
        if (e.target.closest('.menu-trigger')) return;

        const card = e.target.closest('.product-card[data-product-id]');
        if (!card) return;

        const productId = card.dataset.productId;
        router.navigate(`/products/${productId}`);
    });
}