<?php
namespace App\Controllers;

use App\Services\CartService;
use App\Core\Request;
use App\Core\Session;
use App\Core\Response;
use App\Config\Logger;

class CartController
{
    private CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }
    public function getCartItems()
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        Logger::info('Cart Request Debug', [
            'userId' => $userId,
            'guestId' => $guestId,
            'guestId_hex' => bin2hex($guestId)
        ]);

        try {
            $cartItems = $this->cartService->get($userId, $guestId);

            Response::json([
                'success' => true,
                'message' => 'Prodotti del carrello caricati con successo!',
                'data' => $cartItems
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Cart Items failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function insertCartItem(int $productId)
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        $quantity = (int) Request::input('quantity');

        try {
            $cartItem = $this->cartService->insert(
                $userId,
                $guestId,
                $productId,
                $quantity
            );

            Response::json([
                'success' => true,
                'message' => 'Prodotto aggiunto al carrello  con successo!',
                'cart_item' => $cartItem
            ], 201);

        } catch (\Exception $e) {
            Logger::error('Insert Cart Item failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function updateQty(int $productId)
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        $quantity = (int) Request::input('quantity');

        try {
            $newQuantity = $this->cartService->update(
                $userId,
                $guestId,
                $productId,
                $quantity
            );

            Response::json([
                'success' => true,
                'message' => 'Quantità aggiornata con successo',
                'data' => $newQuantity
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Update Cart Item quantity failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function checkout()
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $check = $this->cartService->checkout(
                $userId,
                $guestId,
            );

            Response::json([
                'success' => true,
                'message' => 'Pagamento effettuato con successo',
                'data' => $check
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Checkout failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function deleteCartItem(int $productId)
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $cartItems = $this->cartService->delete(
                $userId,
                $guestId,
                $productId
            );

            Response::json([
                'success' => true,
                'message' => 'Prodotto del carrello eliminato con successo!',
                'data' => $cartItems
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Delete Cart Item failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }
}