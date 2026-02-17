<?php
namespace App\Services;

use App\Repositories\CartRepository;
use App\Config\Logger;


class CartService
{
    private CartRepository $cartRepository;

    public function __construct(CartRepository $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function get(?int $userId, ?string $guestId)
    {
        $cart = $this->cartRepository->getOrCreate($userId, $guestId);

        $cartItems = $this->cartRepository->getCartItems($cart['id']);
        if (empty($cartItems)) {
            Logger::info('Cart Empty', [
                'message' => 'The cart is empty'
            ]);
            return [
                'id' => $cart['id'],
                'cart-items' => [],
                'total-items' => 0,
                'total' => 0
            ];
        }

        $totalCartItems = count($cartItems);

        $totalCart = $this->cartRepository->calculateTotal($cart['id']);

        unset($item);

        return [
            'id' => $cart['id'],
            'cart-items' => $cartItems,
            'total-items' => $totalCartItems,
            'subtotal' => $totalCart
        ];
    }

    public function insert(?int $userId, ?string $guestId, int $productId, int $quantity)
    {
        if ($userId === null && $guestId === null) {
            throw new \InvalidArgumentException('UserId and GuestId cannot both be null');
        }
        $cart = $this->cartRepository->getOrCreate($userId, $guestId);
        if (!$cart || !isset($cart['id'])) {
            throw new \RuntimeException('Invalid cart returned');
        }

        // Troviamo l'item per confrontare
        $item = $this->cartRepository->findCartItem($cart['id'], $productId);

        // Se esiste
        if ($item) {
            $newQuantity = $item['quantity'] + $quantity;

            // Aumenta la quantità
            $this->cartRepository->updateQuantity(
                $cart['id'],
                $productId,
                $newQuantity
            );

            return [
                'id' => $item['id'],
                'quantity' => $newQuantity
            ];
        } else {
            // Altrimenti si aggiunge al carrello
            $itemId = $this->cartRepository->insertCartItem($cart['id'], $productId, $quantity);

            return [
                'id' => $itemId
            ];
        }
    }

    public function update(?int $userId, ?string $guestId, int $productId, int $quantity)
    {
        $cart = $this->cartRepository->getOrCreate($userId, $guestId);

        $item = $this->cartRepository->findCartItem($cart['id'], $productId);
        if (!$item) {
            Logger::warning('Cart item not found', [
                'message' => 'Cart Item not found'
            ]);

            throw new \Exception('Cart item not found');
        }

        // Calcoliamo la nuova quantità
        $newQuantity = $quantity;
        if ($newQuantity >= 1) {
            $this->cartRepository->updateQuantity($cart['id'], $productId, $newQuantity);

            $newTotal = $this->cartRepository->calculateTotal($cart['id']);

            return [
                'id' => $item['id'],
                'quantity' => $newQuantity,
                'cart_total' => $newTotal
            ];
        } else {
            $this->cartRepository->deleteCartItem($cart['id'], $productId);

            return [
                'delete' => true,
                'id' => $item['id']
            ];
        }
    }

    public function delete(?int $userId, ?string $guestId, int $productId)
    {
        $cart = $this->cartRepository->getOrCreate($userId, $guestId);

        $this->cartRepository->deleteCartItem($cart['id'], $productId);

        return [
            'delete' => true,
            'message' => 'Prodotto eliminato dal carrello'
        ];
    }

    public function checkout(?int $userId, ?string $guestId)
    {
        $cart = $this->cartRepository->getOrCreate($userId, $guestId);

        $items = $this->cartRepository->getCartItems($cart['id']);

        // 1. Calcola totale (per mostrarlo all'utente)
        $total = $this->cartRepository->calculateTotal($cart['id']);

        // 2. Svuota il carrello
        $this->cartRepository->clearItems($cart['id']);

        Logger::info('Checkout completed', [
            'user_id' => $userId,
            'guest_id' => $guestId,
            'cart_id' => $cart['id'],
            'total' => $total,
            'items_count' => count($items)
        ]);

        return [
            'message' => 'Ordine completato!',
            'total' => $total,
            'items_count' => count($items)
        ];
    }
}