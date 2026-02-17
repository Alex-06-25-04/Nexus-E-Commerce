<?php
namespace App\Services;

use App\Repositories\FavoriteRepository;
use App\Config\Logger;

class FavoriteService
{
    private FavoriteRepository $favoriteRepository;

    public function __construct(FavoriteRepository $favoriteRepository)
    {
        $this->favoriteRepository = $favoriteRepository;
    }

    /**
     * Restituisce tutti i favoriti di un utente o guest
     *
     * @param int|null $userId
     * @param string|null $guestId
     * @return array
     */
    public function all(?int $userId, ?string $guestId): array
    {
        $favorites = $this->favoriteRepository->getAll($userId, $guestId);

        if (empty($favorites)) {
            Logger::info('Favorite Page Empty', [
                'message' => 'The Favorite Page is empty'
            ]);
        }

        return [
            'favorites' => $favorites,
            'total' => count($favorites)
        ];
    }

    /**
     * Toggle di un prodotto nella lista dei favoriti
     *
     * @param int|null $userId
     * @param string|null $guestId
     * @param int $productId
     * @return array
     */
    public function toggleFavorite(?int $userId, ?string $guestId, int $productId): array
    {
        $exists = $this->favoriteRepository->exists($userId, $guestId, $productId);

        if (!$exists) {
            $this->favoriteRepository->insert($userId, $guestId, $productId);

            return [
                'action' => 'added',
                'message' => 'Aggiunto ai preferiti!',
                'is_favorite' => true
            ];
        }

        $this->favoriteRepository->delete($userId, $guestId, $productId);

        return [
            'action' => 'deleted',
            'message' => 'Rimosso dai preferiti!',
            'is_favorite' => false
        ];
    }

    /**
     * Elimina un item dai favoriti (solo se esiste)
     *
     * @param int|null $userId
     * @param string|null $guestId
     * @param int $productId
     * @return bool
     * @throws \Exception
     */
    public function deleteFavoriteItem(?int $userId, ?string $guestId, int $productId): bool
    {
        $exists = $this->favoriteRepository->exists($userId, $guestId, $productId);

        if (!$exists) {
            Logger::warning('Favorite Item Not Found', [
                'productId' => $productId,
                'userId' => $userId,
                'guestId' => $guestId
            ]);

            throw new \Exception('Favorite item not found');
        }

        return $this->favoriteRepository->delete($userId, $guestId, $productId);
    }
}