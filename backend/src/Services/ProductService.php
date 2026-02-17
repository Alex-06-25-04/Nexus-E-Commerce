<?php
namespace App\Services;

use App\Repositories\ProductRepository;
use App\Core\Request;
use App\Config\Logger;

class ProductService
{
    private ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function onlyDataRequested(int $productId)
    {
        $datas = $this->productRepository->getById($productId, null, null);
        if (empty($datas)) {
            Logger::warning('No product found', [
                'message' => 'Product Not Found'
            ]);

            throw new \Exception('Product Not Found!');
        }

        return $datas;
    }

    public function getColumns()
    {
        return $this->productRepository->getTableColumns();
    }

    public function getAll(?int $userId, ?string $guestId, array $filters)
    {
        $products = $this->productRepository->get($filters, $userId, $guestId);


        return $products;
    }

    public function getProductById(?int $userId, ?string $guestId, int $productId)
    {
        $product = $this->productRepository->getById($productId, $userId, $guestId);
        if (!$product) {

            throw new \Exception('Product Not Found');
        }

        return [
            'id' => $product['id'],
            'image_url' => $product['image_url'],
            'bg_image' => $product['bg_image'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category_name'],
            'price' => $product['price'],
            'stock' => $product['stock'],
            'is_favorite' => (bool) $product['is_favorite']
        ];
    }

    private function handleImageUpload(?array $file, string $fieldName, string $prefix = 'prod')
    {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        if (!Request::isImage($fieldName)) {
            Logger::warning('Image Not Valid', [
                'message' => 'The Image is not valid'
            ]);

            throw new \Exception('The Image is not valid');
        }

        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {

            throw new \Exception('File troppo grande. Max 5MB');
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (!in_array(strtolower($extension), $allowedExtensions)) {

            throw new \Exception('Extension not valid');
        }

        $newName = $prefix . '_' . uniqid() . '.' . $extension;
        $uploadDir = __DIR__ . '/../../public/uploads/products';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        if (move_uploaded_file($file['tmp_name'], $uploadDir . '/' . $newName)) {
            return 'uploads/products/' . $newName; // Questo salverai nel DB
        }

        return null;
    }

    public function createProduct(array $datas)
    {
        if (isset($datas['image'])) {
            $path = $this->handleImageUpload($datas['image'], 'image', 'img');
            if ($path)
                $datas['image_url'] = $path;

            unset($datas['image']);
        }

        if (isset($datas['bg_image'])) {
            $path = $this->handleImageUpload($datas['bg_image'], 'bg_image', 'bg');
            if ($path)
                $datas['bg_image_url'] = $path;

            unset($datas['bg_image']);
        }


        $newProductId = $this->productRepository->create($datas);
        if (!$newProductId) {

            throw new \Exception('Prodotto non aggiunto');
        }

        $product = $this->productRepository->getById($newProductId);

        return [
            'new-product' => [
                'id' => $newProductId,
                'image_url' => $product['image_url'],
                'name' => $product['name'],
                'description' => $product['description'],
                'stock' => $product['stock'],
                'is_active' => $product['is_active']
            ]
        ];
    }

    public function updateProduct(int $productId, array $datas)
    {
        if (isset($datas['image'])) {
            $path = $this->handleImageUpload($datas['image'], 'image', 'img');
            if ($path)
                $datas['image_url'] = $path;

            unset($datas['image']);
        }

        if (isset($datas['bg_image'])) {
            $path = $this->handleImageUpload($datas['bg_image'], 'bg_image', 'bg');
            if ($path)
                $datas['bg_image_url'] = $path;

            unset($datas['bg_image']);
        }


        if (!$productId) {

            throw new \Exception('Prodotto non trovato');
        }

        // Prendo il prodotto corrente dall'id
        $currentProduct = $this->productRepository->getById($productId);
        if (!$currentProduct) {
            Logger::warning('Product Not Found', ['message' => 'Product not found in DB']);
            throw new \Exception('Prodotto non trovato');
        }

        $hasChanges = false;
        // Itero su tutti i campi per prendere chiave e valore
        foreach ($datas as $key => $value) {
            if ($currentProduct[$key] != $value) {
                $hasChanges = true;
                break; // Trovata una differenza, inutile continuare
            }
        }

        return $hasChanges
            ? $this->productRepository->update($productId, datas: $datas)
            : Logger::warning('Same Datas', ['message' => 'Product not updated']);
    }

    public function deleteProduct(int $productId)
    {
        if (!$productId) {

            throw new \Exception('Prodotto non trovato');
        }

        $this->productRepository->inactivate($productId);

        Logger::info('Product Disactivated', [
            'id' => $productId,
            'message' => 'Product disattivated by Admin'
        ]);
    }
}