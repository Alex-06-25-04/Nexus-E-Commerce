<?php
namespace App\Controllers;

use App\Services\FavoriteService;
use App\Core\Request;
use App\Core\Session;
use App\Core\Response;
use App\Config\Logger;

class FavoriteController
{
    private FavoriteService $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    public function index()
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $favorites = $this->favoriteService->all($userId, $guestId);

            Response::json([
                'success' => true,
                'data' => $favorites
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Get Favorites failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function toggle()
    {
        $productId = (int) Request::input('product');

        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $toggle = $this->favoriteService->toggleFavorite($userId, $guestId, $productId);

            Response::json([
                'success' => true,
                'data' => $toggle
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Toggle Favorite failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            Response::json([
                'success' => false,
                'message' => 'Internal Server Error'
            ], 500);
        }
    }

    public function delete(int $productId)
    {
        $user = Session::get('user');

        $userId = $user['id'] ?? null;
        $guestId = Session::getOrCreateGuestId();

        try {
            $this->favoriteService->deleteFavoriteItem($userId, $guestId, $productId);

            Response::json([
                'success' => true,
                'message' => 'Eliminato dalla lista preferiti'
            ], 200);

        } catch (\Exception $e) {
            Logger::error('Delete Favorite failed', [
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